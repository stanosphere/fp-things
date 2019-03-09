const {
  // compose :: (b -> c) -> (a -> b) -> a -> c
  compose,
  // isEqual :: a -> b -> Bool
  isEqual,
  // unary :: ((a, b, ...) -> c) -> a -> c
  unary,
  // map :: (a -> b) -> [a] -> [b]
  map,
  // filter :: (a -> Bool) -> [a] -> [a]
  filter,
} = require('lodash/fp')
const { equals, lte } = require('./algebraic-data-methods')
const Num = require('./Num')

// unCurry :: (a -> b -> c) -> (a, b) -> c
const unCurry = f => (x, y) => f(x)(y)

// not :: (a -> Bool) -> a -> Bool
const not = f => x => !f(x)

// not2 :: (a -> a -> Bool) -> a -> a -> Bool
const not2 = f => x => y => !f(x)(y)

// this uses conventional equality rather than setoid equality
// isNotEqual :: a -> b -> Bool
const isNotEqual = compose(not, isEqual)

// isSetoid :: a -> Bool
const isSetoid = x => !!x.equals

// indexOf :: Setoid a => a -> [a] -> Number
const indexOf = x => (xs) => {
  for (let i = 0; i < xs.length; i += 1) {
    const elem = xs[i]
    if (isSetoid(elem) && elem.equals(x)) return i
  }
  return -1
}

// removeDuplicates :: Setoid a => [a] -> [a]
const removeDuplicates = xs => xs.filter((x, i) => indexOf(x)(xs) === i)

// includes :: Setoid a => a -> [a] -> Bool
const includes = x => compose(isNotEqual(-1), indexOf(x))

// addToArray :: Setoid a => a -> [a] -> [a]
const addToArray = x => xs => (includes(x)(xs) ? xs : [...xs, x])

// removeFromArray :: Setoid a => a -> [a] -> [a]
const removeFromArray = compose(filter, not, equals)

// arraysHaveTheSameContent :: Setoid a => [a] -> [a] -> Bool
const arraysHaveTheSameContent = xs => (ys) => {
  if (!xs || !ys) return false
  if (xs.length !== ys.length) return false
  // this is a slow way of doing it. Perhaps I should sort first
  for (let i = 0; i < xs.length; i += 1) {
    const x = xs[i]
    if (not(includes(x))(ys)) return false
  }
  return true
}

// arraysAreEqual :: Setoid a => [a] -> [a] -> Bool
const arraysAreEqual = xs => (ys) => {
  if (!xs || !ys) return false
  if (xs.length !== ys.length) return false
  for (let i = 0; i < xs.length; i += 1) {
    const x = xs[i]
    const y = ys[i]
    if (isNotEqual(x)(y)) return false
  }
  return true
}

// numbersToNums :: [Number] -> [Num]
const numbersToNums = map(unary(Num))

// toNumber :: Num Number -> Number
const toNumber = x => x.toNumber()

// natural transformation?
// toArray :: Setoid a => PaulSet a -> [a]
const toArray = ps => ps.toArray()

// paulSetOfNumsToArrayOfNumbers :: PaulSet Num -> [Number]
const paulSetOfNumsToNumbers = compose(map(toNumber), toArray)

// this is horribly inefficient since we always iterate through the entire array
// insertInSortedArray :: Ord a => a -> [a] -> [a]
const insertInSortedArray = x => (xs) => {
  let foundPlace = false
  const xIsEqualTo = q => x.equals(q)
  const xIsLessThan = q => x.lte(q) && !xIsEqualTo(q)
  const atFinalPosition = j => j === xs.length - 1
  return xs.reduce((ys, y, i) => {
    if (!foundPlace && xIsEqualTo(y)) {
      foundPlace = true
      return [...ys, y]
    }
    if (!foundPlace && xIsLessThan(y)) {
      foundPlace = true
      return [...ys, x, y]
    }
    if (!foundPlace && atFinalPosition(i)) {
      return [...ys, y, x]
    }
    return [...ys, y]
  }, [])
}

// sort :: (a -> a -> Bool) -> [a] -> [a]
const sort = comp => xs => xs.sort((x, y) => comp(x)(y))

// sortArrayOfOrds :: Ord a => [a] -> [a]
const sortArrayOfOrds = sort(not2(lte))

module.exports = {
  addToArray,
  arraysAreEqual,
  arraysHaveTheSameContent,
  includes,
  insertInSortedArray,
  indexOf,
  isNotEqual,
  isSetoid,
  not,
  numbersToNums,
  paulSetOfNumsToNumbers,
  removeDuplicates,
  removeFromArray,
  sortArrayOfOrds,
  toNumber,
}
