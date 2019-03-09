const daggy = require('daggy')
const {
  // compose :: (b -> c) -> (a -> b) -> a -> c
  compose,
  // map :: (a -> b) -> [a] -> [b]
  map,
  // identity :: a -> a
  identity,
  get,
} = require('lodash/fp')
const Num = require('./Num')
const {
  addToArray,
  arraysAreEqual,
  includes,
  numbersToNums,
  paulSetOfNumsToNumbers,
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

// remove :: Setoid a => PaulSet a ~> a -> PaulSet a
PaulSet.prototype.cardinality = function () {
  return this.cata({
    Set: get('length'),
  })
}

// toArray :: PaulSet a ~> () -> Array a
PaulSet.prototype.toArray = function () {
  return this.cata({
    Set: identity,
  })
}

// has :: PaulSet a ~> a -> Bool
PaulSet.prototype.has = function (x) {
  return this.cata({
    Set: includes(x),
  })
}

// add :: Setoid a => PaulSet a ~> a -> PaulSet a
PaulSet.prototype.add = function (x) {
  return this.cata({
    Set: compose(PaulSet.Set, addToArray(x)),
  })
}

// remove :: Setoid a => PaulSet a ~> a -> PaulSet a
PaulSet.prototype.remove = function (x) {
  return this.cata({
    Set: compose(PaulSet.Set, removeFromArray(x)),
  })
}

// map :: PaulSet a ~> (a -> b) -> PaulSet b
PaulSet.prototype.map = function (f) {
  return this.cata({
    Set: compose(PaulSet.Set, removeDuplicates, map(f)),
  })
}

// equals :: Setoid a => PaulSet a ~> PaulSet a -> Bool
PaulSet.prototype.equals = function (otherSet) {
  const ys = otherSet.xs
  return this.cata({
    Set: arraysAreEqual(ys),
  })
}

// numbersToPaulSet :: [Number] -> PaulSet Num
const numbersToPaulSet = compose(PaulSet.from, numbersToNums)

const emptySet = numbersToPaulSet([])


const numbers = numbersToNums([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

console.log('includes 4?', includes(Num(4))(numbers))
console.log('includes 12?', includes(Num(12))(numbers))

console.log(
  'does our set remove duplicates',
  compose(
    paulSetOfNumsToNumbers,
    numbersToPaulSet,
  )([1, 2, 2, 1]),
)

console.log(
  'does the set { 1, 2 } have 3?',
  numbersToPaulSet([1, 2, 2, 1]).has(Num(3)),
)

console.log(
  'does the set { 1, 2 } have 2?',
  numbersToPaulSet([1, 2, 2, 1]).has(Num(2)),
)

console.log(
  'does the empty set have 2?',
  emptySet.has(Num(2)),
)

console.log(
  'does the empty set have 2?',
  emptySet.has(Num(2)),
)

console.log(
  'can we add elements to the empty set?',
  emptySet.add(Num(1)),
)

console.log(
  'can we add elements to a set?',
  emptySet
    .add(Num(1))
    .add(Num(2))
    .add(Num(2)),
)

console.log(
  'can we remove things from an array?',
  removeFromArray(Num(10))(numbers),
)

console.log(
  'can we remove elements from a set?',
  emptySet
    .add(Num(1))
    .add(Num(2))
    .add(Num(2))
    .remove(Num(2))
    .remove(Num(2)),
)

console.log(
  'can we map over a set?',
  emptySet
    .add(Num(1))
    .add(Num(2))
    .add(Num(3))
    .map(num => num.map(x => x * 2)),
)

// Could we use applicatives here??
console.log(
  'can we map over a set where we expect it to shrink in size?',
  emptySet
    .add(Num(1))
    .add(Num(-1))
    .add(Num(2))
    .map(num => num.map(x => x * x)),
)

const mySet = emptySet
  .add(Num(1))
  .add(Num(-1))
  .add(Num(0))

console.log(
  'is a set equal to itself?',
  mySet.equals(mySet),
)

const mySetWithDifferentOrder = emptySet
  .add(Num(-1))
  .add(Num(0))
  .add(Num(1))

console.log(
  'is a set equal to itself if the elements are added in a different order?',
  mySet.equals(mySetWithDifferentOrder),
  mySetWithDifferentOrder.equals(mySet),

)

console.log(
  'is the empty set equal to itself',
  emptySet.equals(emptySet),
)

const myOtherSet = emptySet
  .add(Num(2))
  .add(Num(-1))
  .add(Num(0))

console.log(
  'does equals return false for two different sets?',
  mySet.equals(myOtherSet),
  myOtherSet.equals(mySet),
  mySet.equals(emptySet),
  emptySet.equals(mySet),
)

const simplenNstedSet = emptySet.add(emptySet)

const nestedSet = emptySet
  .add(Num(7))
  .add(mySet)
  .add(emptySet)
  .add(myOtherSet)

const theSameNestedSet = emptySet
  .add(emptySet)
  .add(mySetWithDifferentOrder)
  .add(myOtherSet)
  .add(Num(7))


console.log(
  'does equals return true for nested sets that are equal to each other?',
  simplenNstedSet.equals(simplenNstedSet),
  theSameNestedSet.equals(nestedSet),
  nestedSet.equals(theSameNestedSet),
  theSameNestedSet.equals(theSameNestedSet),
  nestedSet.equals(nestedSet),
)

module.exports = PaulSet
