const daggy = require('daggy')

const Min = daggy.tagged('Min', ['val'])

// Min is a semigroup and a momoid

// empty :: () ~> Min Number
Min.empty = () => Min(Infinity)

// concat :: Min Number ~> Min Number -> Min Number
Min.prototype.concat = function (that) {
  return Min(Math.min(this.val, that.val))
}

module.exports = Min
