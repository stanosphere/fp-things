const daggy = require('daggy')
const { compose } = require('lodash/fp')

const Predicate = daggy.tagged('Predicate', ['f'])

// concat :: Predicate a ~> Predicate a -> Predicate a
Predicate.prototype.concat = function (that) {
  return Predicate(x => this.f(x) && that.f(x))
}

// contramap :: Predicate a ~> (b -> a) -> Predicate b
Predicate.prototype.contramap = function (f) {
  return Predicate(compose(this.f, f))
}

// empty :: () ~> Predicate Number
Predicate.empty = () => Predicate(() => true)

module.exports = Predicate
