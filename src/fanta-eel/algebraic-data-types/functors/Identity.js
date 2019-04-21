const daggy = require('daggy')

const Identity = daggy.tagged('Identity', ['val'])

// ap :: Identity a ~> Identity (a -> b) -> Identity b
Identity.prototype.ap = function (b) {
  return new Identity(b.val(this.val))
}

// map :: Identity a ~> (a -> b) -> Identity b
Identity.prototype.map = function (f) {
  return Identity(f(this.val))
}

// of :: Identity ~> a -> Identity a
Identity.of = function (x) {
  return Identity(x)
}

module.exports = Identity
