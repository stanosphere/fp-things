const daggy = require('daggy')

const Any = daggy.tagged('Any', ['val'])

Any.prototype.concat = function (that) {
  return Any(this.val || that.val)
}

Any.empty = () => Any(false)

module.exports = Any
