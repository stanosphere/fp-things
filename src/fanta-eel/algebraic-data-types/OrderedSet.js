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
  arraysAreEqual,
  includes,
  insertInSortedArray,
  orderedIntersection,
  orderedUnion,
  removeDuplicates,
  removeFromArray,
  sortArrayOfOrds,
} = require('./helpers')

// OrderedSet will be a collection of Ords
const OrderedSet = daggy.taggedSum('OrderedSet', { Set: ['xs'] })

// could this be considered to be a natural transformation??
// from :: Ord a => OrderedSet ~> Array a -> OrderedSet a
OrderedSet.from = compose(OrderedSet.Set, sortArrayOfOrds, removeDuplicates)

// empty :: () -> OrderedSet ()
OrderedSet.empty = () => OrderedSet.from([])

// add :: Ord a => OrderedSet a ~> a -> OrderedSet a
OrderedSet.prototype.add = function (x) {
  return this.cata({
    Set: compose(OrderedSet.Set, insertInSortedArray(x)),
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

// this promotes the OrderedSet to a SemiGroup since it obeys the laws for concat
// intersection :: Setoid a => OrderedSet a ~> OrderedSet a -> OrderedSet a
OrderedSet.prototype.intersection = function (otherSet) {
  const ys = otherSet.xs
  return this.cata({
    Set: compose(OrderedSet.Set, orderedIntersection(ys)),
  })
}

// map :: OrderedSet a ~> (a -> b) -> OrderedSet b
OrderedSet.prototype.map = function (f) {
  return this.cata({
    Set: compose(
      OrderedSet.Set,
      removeDuplicates,
      sortArrayOfOrds,
      map(f),
    ),
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

// this promotes the OrderedSet to a SemiGroup since it obeys the laws for concat
// union :: Ord a => OrderedSet a ~> OrderedSet a -> OrderedSet a
OrderedSet.prototype.union = function (otherSet) {
  const ys = otherSet.xs
  return this.cata({
    Set: compose(OrderedSet.Set, orderedUnion(ys)),
  })
}

module.exports = OrderedSet
