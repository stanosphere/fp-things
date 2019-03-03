const { identity } = require('lodash/fp')
const { inspect } = require('../utils')

class Identity {
  constructor(x) {
    this.$value = x
  }

  inspect() {
    return `Identity(${inspect(this.$value)})`
  }

  // ----- Pointed Identity
  static of(x) {
    return new Identity(x)
  }

  // map :: Functor a ~> (a -> b) -> Functor b
  map(fn) {
    return Identity.of(fn(this.$value))
  }

  // ap :: Applicative f => f a ~> f (a -> b) -> f b
  ap(f) {
    return f.map(this.$value)
  }

  // chain :: Monad m => m a ~> (a -> m b) -> m b
  chain(fn) {
    return this.map(fn).join()
  }

  // join :: Monad m => m (m a) ~> m a
  join() {
    return this.$value
  }

  // ----- Traversable Identity
  sequence(of) {
    return this.traverse(of, identity)
  }

  traverse(of, fn) {
    return fn(this.$value).map(Identity.of)
  }
}

module.exports = Identity
