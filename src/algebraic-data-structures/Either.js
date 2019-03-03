const { identity } = require('lodash/fp')
const { inspect } = require('../utils')
/* eslint-disable class-methods-use-this */

class Either {
  constructor(x) {
    this.$value = x
  }

  // ----- Pointed (Either a)
  static of(x) {
    return new Right(x)
  }
}

class Left extends Either {
  get isLeft() {
    return true
  }

  get isRight() {
    return false
  }

  static of() {
    throw new Error('`of` called on class Left (value) instead of Either (type)')
  }

  inspect() {
    return `Left(${inspect(this.$value)})`
  }

  // ----- Functor (Either a)
  map() {
    return this
  }

  // ----- Applicative (Either a)
  ap() {
    return this
  }

  // ----- Monad (Either a)
  chain() {
    return this
  }

  join() {
    return this
  }

  // ----- Traversable (Either a)
  sequence(of) {
    return of(this)
  }

  traverse(of) {
    return of(this)
  }
}

class Right extends Either {
  get isLeft() {
    return false
  }

  get isRight() {
    return true
  }

  static of() {
    throw new Error('`of` called on class Right (value) instead of Either (type)')
  }

  inspect() {
    return `Right(${inspect(this.$value)})`
  }

  // ----- Functor (Either a)
  map(fn) {
    return Either.of(fn(this.$value))
  }

  // ----- Applicative (Either a)
  ap(f) {
    return f.map(this.$value)
  }

  // ----- Monad (Either a)
  chain(fn) {
    return fn(this.$value)
  }

  join() {
    return this.$value
  }

  // ----- Traversable (Either a)
  sequence(of) {
    return this.traverse(of, identity)
  }

  traverse(of, fn) {
    fn(this.$value).map(Either.of)
  }
}

module.exports = { Either, Left, Right }
