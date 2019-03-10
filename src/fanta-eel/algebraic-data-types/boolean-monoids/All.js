const daggy = require('daggy')

const All = daggy.tagged('All', ['val'])

All.prototype.concat = function (that) {
  return All(this.val && that.val)
}

All.empty = () => All(true)

module.exports = All
