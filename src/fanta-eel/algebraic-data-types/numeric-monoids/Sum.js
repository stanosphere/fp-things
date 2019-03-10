const daggy = require('daggy')

const Sum = daggy.tagged('Sum', ['val'])

// Sum is a semigroup and a momoid

// empty :: () ~> Sum Number
Sum.empty = () => Sum(0)

// concat :: Sum Number ~> Sum Number -> Sum Number
Sum.prototype.concat = function (that) {
  return Sum(this.val + that.val)
}

module.exports = Sum
