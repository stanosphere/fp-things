const daggy = require('daggy')

// A coordinate in 3D space.
// Coord :: (Int, Int, Int) -> Coord
const Coord = daggy.tagged('Coord', ['x', 'y', 'z'])

// equals :: Coord ~> Coord -> Bool
Coord.prototype.equals = function (that) {
  return this.x === that.x
    && this.y === that.y
    && this.z === that.z
}

// equals :: Coord ~> Coord -> Bool
Coord.prototype.lte = function (that) {
  const thisMagnitude = Math.hypot(this.x, this.y, this.z)
  const thatMagnitude = Math.hypot(that.x, that.y, that.z)
  return thisMagnitude <= thatMagnitude
}

// scale :: Coord ~> (Int, Int, Int) -> Coord
Coord.prototype.scale = function (x, y, z) {
  return Coord(
    this.x * x,
    this.y * y,
    this.z * z,
  )
}

// translate :: Coord ~> (Int, Int, Int) -> Coord
Coord.prototype.translate = function (x, y, z) {
  return Coord(
    this.x + x,
    this.y + y,
    this.z + z,
  )
}

module.exports = Coord
