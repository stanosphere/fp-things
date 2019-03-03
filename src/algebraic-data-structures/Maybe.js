const { identity } = require('lodash/fp')
const { inspect } = require('../utils')

class Maybe {
  get isNothing() {
    return this.$value === null || this.$value === undefined
  }

  get isJust() {
    return !this.isNothing
  }

  constructor(x) {
    this.$value = x
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`
  }

  // ----- Pointed Maybe
  static of(x) {
    return new Maybe(x)
  }

  // ----- Functor Maybe
  // map :: Functor f => f a ~> (a -> b) -> f b
  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value))
  }

  // ----- Applicative Maybe
  ap(f) {
    return this.isNothing ? this : f.map(this.$value)
  }

  // ----- Monad Maybe
  // chain :: Monad M => (a -> M b) -> M a -> M b
  chain(fn) {
    return this.map(fn).join()
  }

  // join :: Monad M => M (M a) ~> M a
  join() {
    return this.isNothing ? this : this.$value
  }

  // ----- Traversable Maybe
  sequence(of) {
    this.traverse(of, identity)
  }

  traverse(of, fn) {
    return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of)
  }
}

module.exports = Maybe
