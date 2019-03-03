const { identity } = require('lodash/fp')
const { inspect } = require('../utils')

class Map {
  constructor(x) {
    this.$value = x
  }

  inspect() {
    return `Map(${inspect(this.$value)})`
  }

  insert(k, v) {
    const singleton = {}
    singleton[k] = v
    return Map.of(Object.assign({}, this.$value, singleton))
  }

  reduceWithKeys(fn, zero) {
    return Object.keys(this.$value)
      .reduce((acc, k) => fn(acc, this.$value[k], k), zero)
  }

  // ----- Functor (Map a)
  map(fn) {
    return this.reduceWithKeys(
      (m, v, k) => m.insert(k, fn(v)),
      new Map({}),
    )
  }

  // ----- Traversable (Map a)
  sequence(of) {
    return this.traverse(of, identity)
  }

  traverse(of, fn) {
    return this.reduceWithKeys(
      (f, a, k) => fn(a).map(b => m => m.insert(k, b)).ap(f),
      of(new Map({})),
    )
  }
}

module.exports = Map
