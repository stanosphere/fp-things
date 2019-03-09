const daggy = require('daggy')
const {
  // compose :: (b -> c) -> (a -> b) -> a -> c
  compose,
  // map :: (a -> b) -> [a] -> [b]
  map,
  // identity :: a -> a
  identity,
  // get :: String -> Object -> Object | String
  get,
} = require('lodash/fp')
const {
  addToArray,
  arraysAreEqual,
  includes,
  removeDuplicates,
  removeFromArray,
} = require('./helpers')

// OrderedSet will be a collection of Ords
const OrderedSet = daggy.taggedSum('OrderedSet', { Set: ['xs'] })

// could this be considered to be a natural transformation??
// from :: Ord a => OrderedSet ~> Array a -> OrderedSet a
OrderedSet.from = compose(OrderedSet.Set, removeDuplicates)

// empty :: () -> OrderedSet ()
OrderedSet.empty = () => OrderedSet.from([])

// add :: Ord a => OrderedSet a ~> a -> OrderedSet a
OrderedSet.prototype.add = function (x) {
  return this.cata({
    Set: compose(OrderedSet.Set, addToArray(x)),
  })
}

// remove :: Ord a => OrderedSet a ~> a -> OrderedSet a
OrderedSet.prototype.cardinality = function () {
  return this.cata({
    Set: get('length'),
  })
}

// equals :: Ord a => OrderedSet a ~> OrderedSet a -> Bool
OrderedSet.prototype.equals = function (otherSet) {
  const ys = otherSet.xs
  return this.cata({
    Set: arraysAreEqual(ys),
  })
}

// has :: OrderedSet a ~> a -> Bool
OrderedSet.prototype.has = function (x) {
  return this.cata({
    Set: includes(x),
  })
}

// map :: OrderedSet a ~> (a -> b) -> OrderedSet b
OrderedSet.prototype.map = function (f) {
  return this.cata({
    Set: compose(OrderedSet.Set, removeDuplicates, map(f)),
  })
}

// remove :: Ord a => OrderedSet a ~> a -> OrderedSet a
OrderedSet.prototype.remove = function (x) {
  return this.cata({
    Set: compose(OrderedSet.Set, removeFromArray(x)),
  })
}

// toArray :: OrderedSet a ~> () -> Array a
OrderedSet.prototype.toArray = function () {
  return this.cata({
    Set: identity,
  })
}

module.exports = OrderedSet
