const daggy = require('daggy')
const { concat } = require('../algebraic-data-methods')

const Maybe = daggy.taggedSum('Maybe', {
  Just: ['val'], Nothing: [],
})

// isNothing :: a -> Bool
const isNothing = x => x === null || x === undefined

const { Just, Nothing } = Maybe

// empty Maybe ~> () -> Maybe a
Maybe.empty = () => Nothing

// ap :: Maybe a ~> Maybe (a -> b) -> Maybe b
Maybe.prototype.ap = function (f) {
  const fn = f.val
  return this.cata({
    Just: val => (isNothing(fn) ? Nothing : Just(fn(val))),
    Nothing: () => Nothing,
  })
}

// concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
Maybe.prototype.concat = function (that) {
  return this.cata({
    Just: x => (isNothing(that.val) ? this : that.map(concat(x))),
    Nothing: () => that,
  })
}

// map :: Maybe a ~> (a -> b) -> Maybe b
Maybe.of = function (x) {
  return isNothing(x) ? Nothing : Just(x)
}

// map :: Maybe a ~> (a -> b) -> Maybe b
Maybe.prototype.map = function (f) {
  return this.cata({
    Just: (val) => {
      const res = f(val)
      return isNothing(res) ? Nothing : Just(res)
    },
    Nothing: () => Nothing,
  })
}

module.exports = Maybe
