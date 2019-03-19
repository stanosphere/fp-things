const daggy = require('daggy')

const Either = daggy.taggedSum('Either', {
  Right: ['val'], Left: ['val'],
})

const { Right, Left } = Either

// Now, we provide a "default" for null values
// of :: Either ~> (a, ?b) -> Either a b
Either.of = function (left, right) {
  return (right == null ? Left(left) : Right(right))
}

// fold :: Either a b ~> (a -> c, b -> c) -> c
Either.prototype.fold = function (leftFold, rightFold) {
  return this.cata({
    Left: leftFold,
    Right: rightFold,
  })
}

// map :: Either a b ~> (b -> c) -> Either a c
Either.prototype.map = function (f) {
  return this.cata({
    Left,
    Right: val => Right(f(val)),
  })
}

module.exports = Either
