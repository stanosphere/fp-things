const { compose, map, reduce } = require('lodash/fp')
const daggy = require('daggy')
const {
  Max,
  Product,
  Sum,
} = require('../algebraic-data-types/numeric-monoids/index')
const {
  Any,
} = require('../algebraic-data-types/boolean-monoids/index')
const { concat } = require('../algebraic-data-types/algebraic-data-methods')

// As well as the ususal blog post we can look here:
// http://www.tomharding.me/2016/11/03/monoid-est-tonoid/

// A monoid is an extension of a semi group
// It is a semi group that has a notion of identity
// We'll store it on a function called `empty`

// - a Monoid implements empty
// -- empty :: Monoid m => () -> m

// It satisfies the identity laws
// suppose m is a Monoid
// -- Monoid m => ...

// - Right identity
// -- m(x).concat(m.empty()) === m(x)

// - Left identity
// -- m.empty().concat(m(x)) === m(x)

// remember all monoids are semi groups so automatically have a concat on them

// Quite often I think I've been putting my empties on things
// For example my empty set and empty list
// Often I test that they satisfy the identity laws

// So I've just gone through and added some numeric monoids

// With a Semigroup you can combine one or more values to make another
// All a monoid does is let us upgrade that to *zero* or more
// this is beautiful because it now means we can fold these things!
// the existence of an identity allows us to write a consistent fold function

// A friendly neighbourhood monoid fold.
// fold :: Monoid m => (a -> m a) -> [a] -> m a
const fold = M => reduce(
  (acc, x) => acc.concat(M(x)),
  M.empty(),
)

// the above fold takes a function that wraps a value in a monoid
// because all these values are wrapped in a monoid we can reduce said monoid
// via the magic of concatenation

console.log(fold(Sum)([1, 2, 3, 4, 5]).val) // 15
console.log(fold(Product)([1, 2, 3]).val) // 6
console.log(fold(Max)([9, 7, 11]).val) // 11
console.log(fold(Sum)([]).val) // 0, yay!

// the above is soooo powerful!
// our humble lets us fold ANY reducible structure!!
// be it an array, list, set, tree, ordered set, whatever!
// also it lets us fold over ANY monoid
// for example I could have used the boolean monoids Any and All.

// And we're not done on the coolness front
// Remembering that all monoids are semi groups
// and that concat is associative:
// this associativity gives us an opportunity to parallelise
// If we split a list of semigroups into chunks,
// concat the elements of each chunk in parallel,
// and then concat the results, we’re guaranteed to get the same result!
// how beautiful

// for pedagogical reasons the following will be not quite perfect

// In practice, you'd want a generator here...
// Non-tail-recursion is expensive in JS!
// chunk :: [a] -> [[a]]
const chunk = xs => (xs.length < 5000
  ? [xs]
  : [xs.slice(0, 5000), ...chunk(xs.slice(5000))]
)

// this is cheating but it's for illustration purposes
// RunThisThingOnANewThread :: (a -> b) -> a -> b
const RunThisThingOnANewThread = f => x => f(x)

// parallelMap :: (a -> b) -> [a] -> [b]
const parallelMap = compose(map, RunThisThingOnANewThread)

// Chunk, fold in parallel, fold the result.
// In practice, this would probably be async.
// foldP Monoid m => :: (a -> m a) -> [a] -> m a
const foldP = M => xs => parallelMap(fold(M))(chunk(xs))
  .reduce(
    (_xs, ys) => _xs.concat(ys),
    M.empty(),
  )
// in the above, the bit before the reduce gives us some monoids
// we then use the reduce to concat them

const bigList = [...Array(1e6)].map((_, i) => i)

console.log(foldP(Sum)(bigList).val) // 499999500000

// obviously I've not *actually* done any parallelisationb but you get the idea

// so that's all pretty marvalous but what are the downsides?
// the downside is that we're in JS and JS can't infer types

// How do we know which `empty` we want? In
// Haskell, the correct `empty` would be used
// because the type would be checked to find the
// right monoid instance in the context.
// -- const concatAll = xs => xs.reduce(concat, empty)

// but in JS we have to do what we do in the fold function higher up

// composed monoids are annoying af

// We now have a kind of "Pair factory"!
// we need to lock in the empties of the types that the pair takes
// Pair_ :: (Monoid a, Monoid b) => (TypeRep a, TypeRep b) -> (a, b) -> Pair a b
const PairGenerator = (typeA, typeB) => {
  const Pair = daggy.tagged('Pair', ['a', 'b'])

  Pair.empty = () => Pair(typeA.empty(), typeB.empty())

  // perhaps concat should check that a is indeed of type a
  // and that b is ideed of type b
  Pair.prototype.concat = function (that) {
    return Pair(
      this.a.concat(that.a),
      this.b.concat(that.b),
    )
  }

  return Pair
}

// We can partially apply to get Pair
// constructors for specific types...
const SumAndAny = PairGenerator(Sum, Any)

// ... and these have valid empty() values!
// Pair(Sum(0), Any(False))
console.log(SumAndAny.empty().toString())

// let's check we can concat these guys in the way we expect

const SumAndMax = PairGenerator(Sum, Max)

console.log(SumAndMax(Sum(10), Max(12)).concat(SumAndMax(Sum(30), Max(10))).toString())

// this is fucking confusing

// lets try and make a nicer generator
// I need to give it an empty method so I wrap it in a closure to do so

// SumAndMax2 :: Number -> Pair (Sum Number, Max Number)
const SumAndMax2 = (() => {
  const pair = PairGenerator(Sum, Max)

  const wrap = x => pair(Sum(x), Max(x))

  wrap.empty = pair.empty

  return wrap
})()

console.log(
  concat(SumAndMax2(10))(SumAndMax2(20))
    .toString(),
)

// hopefully a bit clearer!

// let's try folding over this
// consider what it would be for our array of numbers

// fold :: (Number -> Pair (Sum Number, Max Number)) -> [a] -> Pair (Sum Number, Max Number)
console.log(fold(SumAndMax2)([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).toString())

// some more thoughts from the other blog post

// A monoid is a structure that can be appended to other instances of the same structure,
// It must also have an identity instance
// The append method is associative
// However in the above I've used the word concat from fantasy land rather than append
// The associativity of this append operation makes parallelisation good
