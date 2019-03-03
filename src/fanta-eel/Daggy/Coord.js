const daggy = require('daggy')

// A coordinate in 3D space.
// Coord :: (Int, Int, Int) -> Coord
const Coord = daggy.tagged('Coord', ['x', 'y', 'z'])

// translate :: Coord ~> (Int, Int, Int) -> Coord
Coord.prototype.translate = function (x, y, z) {
  return Coord(
    this.x + x,
    this.y + y,
    this.z + z,
  )
}

module.exports = Coord
