const daggy = require('daggy')

const Identity = daggy.tagged('Identity', ['val'])

// ap :: Identity a ~> Identity (a -> b) -> Identity b
Identity.prototype.ap = function (b) {
  return new Identity(b.x(this.x))
}

// map :: Identity a ~> (a -> b) -> Identity b
Identity.prototype.map = function (f) {
  return Identity(f(this.val))
}

module.exports = Identity
