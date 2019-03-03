const daggy = require('daggy')

const Shape = daggy.taggedSum('Shape', {
  // Square :: (Coord, Coord) -> Shape
  Square: ['topleft', 'bottomright'],

  // Circle :: (Coord, Number) -> Shape
  Circle: ['centre', 'radius'],
})

// translate :: Shape ~> (Int, Int, Int) -> Shape
Shape.prototype.translate = function (x, y, z) {
  return this.cata({
    Square: (topleft, bottomright) => Shape.Square(
      topleft.translate(x, y, z),
      bottomright.translate(x, y, z),
    ),

    Circle: (centre, radius) => Shape.Circle(
      centre.translate(x, y, z),
      radius,
    ),
  })
}


module.exports = Shape
