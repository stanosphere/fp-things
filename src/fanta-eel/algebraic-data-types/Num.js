const daggy = require('daggy')

// the purpose of this is to make a number type that is a setoid
// so I can play aound with my PaulSet type :p

// Num :: Number -> Num Number
const Num = daggy.tagged('Num', ['x'])

// equals :: Num Number ~> Num Number -> Bool
Num.prototype.equals = function (num) {
  return this.x === num.x
}

// lte :: Num Number ~> Num Number -> Bool
Num.prototype.lte = function (num) {
  return this.x <= num.x
}

// toNumber :: Num Number ~> () -> Number
Num.prototype.toNumber = function () {
  return this.x
}

// map :: Num Number ~> (Number -> Number) -> Num Number
Num.prototype.map = function (f) {
  return Num(f(this.x))
}

module.exports = Num
