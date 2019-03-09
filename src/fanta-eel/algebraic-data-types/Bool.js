const daggy = require('daggy')

const Bool = daggy.taggedSum('Bool', {
  True: [], False: [],
})

const { True, False } = Bool

// invert :: Bool ~> () -> Bool
Bool.prototype.invert = function () {
  return this.cata({
    False: () => True,
    True: () => False,
  })
}

// this is kind of a short hand for accessing the catamorphism I suppose
// thenElse :: Bool ~> (a, b) -> Bool
Bool.prototype.thenElse = function (then, or) {
  return this.cata({
    True: then,
    False: or,
  })
}

module.exports = Bool
