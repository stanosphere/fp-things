const daggy = require('daggy')
const Maybe = require('../algebraic-data-types/functors/Maybe')

const { Just, Nothing } = Maybe

const show = x => console.log(x.toString())

// - an Alt implements alt
// -- alt :: Alt f => f a ~> f a -> f a

// an Alt satisfies the Associativity and Distributivity laws:
// -- Alt a, Alt b, Alt c => ...

// - Associativity
// -- a.alt(b).alt(c) === a.alt(b.alt(c))

// - Distributivity
// -- a.alt(b).map(f) === a.map(f).alt(b.map(f))

// this is a bit like a Semigroup but for functors
// however it does not require the inner type of the functor to be a semi group
// it is most natural to think of alt as providing alternate (or fallback) values for something
// this is particularly pertinent for types that have a notion of failure

Maybe.prototype.alt = function (that) {
  return this.cata({
    Just: () => this,
    Nothing: () => that,
  })
}

show(Nothing.alt(Nothing).alt(Just(3)))

// so we now kind of have a functor level semigroup
// what I mean by this is a function that takes a pair of functors
// and combines them to crerate a functor of the same type

// so can we also have a functor level monoid?
// in the same way that we extebnded semigroups to make monoids
// (we did this by adding an `empty` method)
// we shall extend Alts to become Plus's by endowing them with a function called `zero`

// -- zero :: Plus f => () -> f a

// Just like the monoid's empty zero obeys right and left identity
// -- Plus x, Plus y => ...

// - Right Identity
// -- x.alt(y.zero()) === x

// - Left Identity
// -- y.zero().alt(x) === x

// zero also obeys the annhilation law
// - Annihilation
// -- x.zero().map(f) === x.zero()

// that annihilation law is a bit scary!
// it looks as though zero is always mapped to zero no matter what function we pass it
// it must therefore have a very strong notion of "emptiness"

// The most obvious example is that the Nothing in Maybe acts as a zero
// Whenever you try to map over it ytou just get nothing back
// Nothing shall come of nothing Cordelia

// the only possible implementation I can think of for an array is of course the empty array

Maybe.zero = function () {
  return Maybe.Nothing
}

Array.zero = function () {
  return []
}

// this is also analogous to how Applicative adds a notion of identity to Apply

// The value MUST be an Alt-implementer.
const Alt = daggy.tagged('Alt', ['value'])

// Alt is a valid semigroup!
Alt.prototype.concat = function (that) {
  return Alt(this.value.alt(that.value))
}

// given a Plus, we can upgrade it to be a semigroup and a monoid:

/* eslint-disable no-underscore-dangle */
// The value MUST be a Plus-implementer.
// And, as usual, we need a TypeRep...
const Plus = (T) => {
  const Plus_ = daggy.tagged('Plus', ['value'])

  // Plus is a valid semigroup...
  Plus_.prototype.concat = function (that) {
    return Plus_(this.value.alt(that.value))
  }

  // ... and a valid monoid!
  Plus_.empty = () => Plus_(T.zero())

  return Plus_
}

// for this to work we require that Just('l') and Nothing already implement Plus

const PlusJustL = Plus(Maybe)(Just('l'))
const PlusNothing = Plus(Maybe)(Nothing)

show(PlusJustL.concat(PlusNothing))
show(PlusNothing.concat(PlusJustL))

// the final thing we care about here is an Alternative
// A thing that is both an Applicative *and* a Plus
// amazing

// this of course comes with some laws
// which I imagine simply follow logically from the laws of Plus and Applicative

// - Distributivity
// -- x.ap(f.alt(g)) === x.ap(f).alt(x.ap(g))

// - Annihilation
// -- x.ap(A.zero()) === A.zero()

// this can be regarded as a monoid shaped applicative
