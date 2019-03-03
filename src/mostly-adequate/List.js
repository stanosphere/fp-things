const { identity } = require('lodash/fp')
const { inspect } = require('../utils')

class List {
  constructor(xs) {
    this.$value = xs
  }

  inspect() {
    return `List(${inspect(this.$value)})`
  }

  concat(x) {
    return new List(this.$value.concat(x))
  }

  // ----- Pointed List
  static of(x) {
    return new List([x])
  }

  // ----- Functor List
  map(fn) {
    return new List(this.$value.map(fn))
  }

  // ----- Traversable List
  sequence(of) {
    return this.traverse(of, identity)
  }

  traverse(of, fn) {
    return this.$value.reduce(
      (f, a) => fn(a).map(b => bs => bs.concat(b)).ap(f),
      of(new List([])),
    )
  }
}

module.exports = List
