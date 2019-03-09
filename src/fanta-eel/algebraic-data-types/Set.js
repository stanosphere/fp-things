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
  arraysHaveTheSameContent,
  includes,
  removeDuplicates,
  removeFromArray,
} = require('./helpers')


// In this implementation of 'Set' I will use an array behind the scenes
// I _could_ have used the linked list if I wanted to make this 'from scratch'

// don't want to be overwriting the ES6 Set
// it is perhaps easiest top base this on our lovely native Array
// don't actually need the Sum Type here lol
const PaulSet = daggy.taggedSum('PaulSet', { Set: ['xs'] })

// could this be considered to be a natural transformation??
// from :: Setoid a => PaulSet ~> Array a -> PaulSet a
PaulSet.from = compose(PaulSet.Set, removeDuplicates)

// empty :: () -> PaulSet ()
PaulSet.empty = () => PaulSet.from([])

// add :: Setoid a => PaulSet a ~> a -> PaulSet a
PaulSet.prototype.add = function (x) {
  return this.cata({
    Set: compose(PaulSet.Set, addToArray(x)),
  })
}

// remove :: Setoid a => PaulSet a ~> a -> PaulSet a
PaulSet.prototype.cardinality = function () {
  return this.cata({
    Set: get('length'),
  })
}

// equals :: Setoid a => PaulSet a ~> PaulSet a -> Bool
PaulSet.prototype.equals = function (otherSet) {
  const ys = otherSet.xs
  return this.cata({
    Set: arraysHaveTheSameContent(ys),
  })
}

// has :: PaulSet a ~> a -> Bool
PaulSet.prototype.has = function (x) {
  return this.cata({
    Set: includes(x),
  })
}

// map :: PaulSet a ~> (a -> b) -> PaulSet b
PaulSet.prototype.map = function (f) {
  return this.cata({
    Set: compose(PaulSet.Set, removeDuplicates, map(f)),
  })
}

// remove :: Setoid a => PaulSet a ~> a -> PaulSet a
PaulSet.prototype.remove = function (x) {
  return this.cata({
    Set: compose(PaulSet.Set, removeFromArray(x)),
  })
}

// toArray :: PaulSet a ~> () -> Array a
PaulSet.prototype.toArray = function () {
  return this.cata({
    Set: identity,
  })
}

module.exports = PaulSet
