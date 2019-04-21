const daggy = require('daggy')
const { Identity, Maybe } = require('../algebraic-data-types/functors')
const { List } = require('../algebraic-data-types')
const { concat } = require('../algebraic-data-types/algebraic-data-methods')

const show = x => console.log(x.toString())

// Applicative types are Apply types with one extra function
// `of`

// `of` just lets us lift a value into an Applicative

// - an Applicative implements of
// -- of :: Applicative f => a -> f a

// an Apply satisfies the Identity, Homomorphism, and Interchange laws:
// -- Applicative A, Apply v => ...

// - Identity
// -- v.ap(A.of(x => x)) === v

// - Homomorphism
// -- A.of(x).ap(A.of(f)) === A.of(f(x))

// - Interchange
// -- A.of(y).ap(u) === u.ap(A.of(f => f(y)))

// so what do these all mean?

// the Identity law tells us that lifting the unit function into our context
// and then applying it to the inner value does nothing

// Homomorphism shows us that we either lift a function and a value seperately
// or combine them and then lift them into our context
// This shows us that of is nothing more than a liftering operation; no side effects

// Interchange is bonkers

// so let's see this `of` in action!

// append :: a -> [a] -> [a]
const append = y => xs => xs.concat([y])

// There's that sneaky lift2 again!
// lift2 :: Applicative f => (a, b, c) -> f a -> f b -> f c
const lift2 = (f, a, b) => b.ap(a.map(f))

// insideOut :: Applicative f => [f a] -> f [a]
const insideOut = (T, xs) => xs.reduce(
  (acc, x) => lift2(append, x, acc),
  T.of([]),
)

const { Just, Nothing } = Maybe

show(insideOut(Maybe, [Just(2), Just(10), Just(3)]))

show(insideOut(Maybe, [Just(2), Nothing, Just(3)]))

// so what is the above trying to teach us?
// It's an example of `of` allowing us to write generic functions that will work on
// *ANY* applicative
// in this example we have a function that takes an array of applicative-wrapped values
// and returns an applicative-wrapped list of values

show(insideOut(Maybe, List.from([Just(2), Just(10), Just(3)])))

show(insideOut(Maybe, List.from([Just(2), Nothing, Just(3)])))

// Semigroups and Monoids are thematically similar to Applies and Applicatives

// concat can combine any non-zero number of values (of the same type) into one.
// ap can combine any non-zero number of contexts (of the same type) into one.
// If we might need to handle zero values, we will need to use empty.
// If we might need to handle zero contexts, we will need to use of.

// you can turn any Applicative into a valid Monoid if the inner type is a Monoid

// Note: we need a TypeRep to get empty!
const MyApplicative = (T) => {
  // Whatever your instance is...
  // in this case I know I need to base it off the Maybe type
  // I wonder if this could be more generic
  // like if I could somehow just copy the skeleton of a daggy thing?
  const MyApp = daggy.taggedSum('MyApp', {
    Just: ['val'], Nothing: [],
  })

  // define ap/of/map...
  MyApp.prototype.map = T.prototype.map
  MyApp.prototype.of = T.prototype.of
  MyApp.prototype.ap = T.prototype.ap

  // concat :: Semigroup a => MyApp a ~> MyApp a -> MyApp a
  MyApp.prototype.concat = function (that) {
    return lift2(concat, this, that)
  }

  // empty :: Monoid a => () -> MyApp a
  MyApp.prototype.empty = () => MyApp.of(T.empty())

  return MyApp
}

show(MyApplicative(Identity))
show(MyApplicative(Maybe))

const enhancedMaybe = MyApplicative(Maybe)

const Just2 = enhancedMaybe.Just
const Nothing2 = enhancedMaybe.Nothing

// Usual implementation:
show(Just([2]).concat(Just([3]))) // Just([2, 3])
show(Just([2]).concat(Nothing)) // Just([2])
show(Nothing.concat(Just([3]))) // Just([3])
show(Nothing.concat(Nothing)) // Nothing

// // With the above implementation:
show(Just2([2]).concat(Just2([3]))) // Just([2, 3])
show(Just2([2]).concat(Nothing2)) // Nothing
show(Nothing2.concat(Just2([3]))) // Nothing
show(Nothing2.concat(Nothing2)) // Nothing

// this shows us that there are many implementations that satisfy the laws
// It is up to the author to make a judicious choice of implementation details

// the other thing this tells us is that one can *ALWAYS* construct
// at least one monoid from an Applicative!
// It's simply a mathematical fact

// for many of our classes the implementation of `of` is simple
// we just wrap our value in the type. easy.

// Array.of = x => [x]
// Either.of = x => Right(x)
// Function.of = x => _ => x
// Maybe.of = x => Just(x)
// Task.of = x => new Task((_, res) => res(x))

// But whings can go rather pear shaped if we consider something like a Pair
// That is to say a type that must contain more than one value

// Pair :: (l, r) -> Pair l r
const Pair = daggy.tagged('Pair', ['x', 'y'])

// Map over the RIGHT side. The functor
// is `Pair l` and `r` is the inner type.
// map :: Pair l r ~> (r -> s) -> Pair l s
Pair.prototype.map = function (f) {
  return Pair(this.x, f(this.y))
}

// Apply this to that, retain this' left.
// ap :: Pair l r ~> Pair l (r -> s) -> Pair l s
Pair.prototype.ap = function (that) {
  return Pair(this.x, that.y(this.y))
}

// But wait...
// of :: r -> Pair l r
Pair.of = function (x) {
  return Pair('WHAT GOES HERE????', x)
}

// so how in the hell to we sort this mess out?
// The answer, as always, is to impose relevant type constraints
// If we constrain `l` to be a Monoid, then in our implementation
// of `of` we can simply use the empty value of `l`!

// The way we do this in JS land is using the type ref thing

// TypeRep!
const Pair2 = (T) => {
  /* eslint-disable no-underscore-dangle */
  const Pair_ = daggy.tagged('Pair', ['x', 'y'])

  // And now we're fine! Hooray!
  Pair_.of = x => Pair_(T.empty(), x)

  return Pair_
}

Array.empty = () => []

// SUCCESS!
const MyPair = Pair2(Array)
show(MyPair.of(2)) // Pair([], 2)
