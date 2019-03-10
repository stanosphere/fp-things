const daggy = require('daggy')

const Max = daggy.tagged('Max', ['val'])

// Max is a semigroup and a momoid

// empty :: () ~> Max Number
Max.empty = () => Max(-Infinity)

// concat :: Max Number ~> Max Number -> Max Number
Max.prototype.concat = function (that) {
  return Max(Math.max(this.val, that.val))
}

module.exports = Max
