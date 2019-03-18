const daggy = require('daggy')

const Identity = daggy.tagged('Identity', ['val'])

// map :: Identity a ~> (a -> b) -> Identity b
Identity.prototype.map = function (f) {
  return Identity(f(this.val))
}

module.exports = Identity
