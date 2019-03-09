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
const { equals } = require('./algebraic-data-methods')
const Num = require('./Num')

// not :: (a -> Bool) -> a -> Bool
const not = f => x => !f(x)

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

// includes :: Setoid a => a -> [a] -> Number
const includes = x => compose(isNotEqual(-1), indexOf(x))

// addToArray :: Setoid a => a -> [a] -> [a]
const addToArray = x => xs => (includes(x)(xs) ? xs : [...xs, x])

// removeFromArray :: Setoid a => a -> [a] -> [a]
const removeFromArray = compose(filter, not, equals)

// arraysAreEqual :: Setoid a => [a] -> [a] -> Bool
const arraysAreEqual = xs => (ys) => {
  if (!xs || !ys) return false
  if (xs.length !== ys.length) return false
  // this is a slow way of doing it. Perhaps I should sort first
  for (let i = 0; i < xs.length; i += 1) {
    const x = xs[i]
    if (not(includes(x))(ys)) return false
  }
  return true
}

// numbersToNums :: [Number] -> [Num]
const numbersToNums = map(unary(Num))

// paulSetOfNumsToArrayOfNumbers :: PaulSet Num -> [Number]
const paulSetOfNumsToNumbers = ps => map(x => x.toNumber())(ps.toArray())

module.exports = {
  addToArray,
  arraysAreEqual,
  includes,
  indexOf,
  isNotEqual,
  isSetoid,
  not,
  numbersToNums,
  paulSetOfNumsToNumbers,
  removeDuplicates,
  removeFromArray,
}
