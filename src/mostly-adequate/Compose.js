const { curry } = require('lodash/fp')
const { inspect } = require('../utils')

const createCompose = curry((F, G) => class Compose {
  constructor(x) {
    this.$value = x
  }

  inspect() {
    return `Compose(${inspect(this.$value)})`
  }

  // ----- Pointed (Compose F G)
  static of(x) {
    return new Compose(F(G(x)))
  }

  // ----- Functor (Compose F G)
  map(fn) {
    return new Compose(this.$value.map(x => x.map(fn)))
  }

  // ----- Applicative (Compose F G)
  ap(f) {
    return f.map(this.$value)
  }
})

module.exports = createCompose
