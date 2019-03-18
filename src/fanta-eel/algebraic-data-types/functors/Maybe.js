const daggy = require('daggy')

const Maybe = daggy.taggedSum('Maybe', {
  Just: ['val'], Nothing: [],
})

// isNothing :: a -> Bool
const isNothing = x => x === null || x === undefined

const { Just, Nothing } = Maybe

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
