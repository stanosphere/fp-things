const daggy = require('daggy')

// the purpose of this is to make a number type that is a setoid
// so I can play aound with my PaulSet type :p

// Num :: Number -> Num
const Num = daggy.tagged('Num', ['x'])

// equals :: Num ~> Num -> Bool
Num.prototype.equals = function (num) {
  return this.x === num.x
}

// equals :: Num ~> Num -> Bool
Num.prototype.toNumber = function () {
  return this.x
}

// equals :: Num ~> Num -> Bool
Num.prototype.map = function (f) {
  return Num(f(this.x))
}

console.log(Num(2).equals(Num(2)))

module.exports = Num
