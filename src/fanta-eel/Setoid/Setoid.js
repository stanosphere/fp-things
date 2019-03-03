const { zipWith } = require('lodash/fp')
const {
  Bool, Coord, Line, List,
} = require('../Daggy/index')

// apparently this is called Eq in the Haskell world

// - A setoid implements equals
// -- equals :: Setoid a => a ~> a -> Boolean

// it also satisfies some laws. here they are
// Suppose that a and b are Setoids
// -- (Setoid a, Setoid b => ...)

// - Reflexivity
// -- a.equals(a) === true

// - Symmetry (also called Commutivity)
// -- a.equals(b) === b.equals(a)
// of course a.equals(b) could be true or false

// - Transitivity
// -- IF a.equals(b) AND b.equals(c) THEN a.equals(c)
// this is reminiscent of the 1st law of thermodynamics lol

// now let's make some of the classes we defined earlier into Setoids
// This is simply done by implementing the relevant equals method

// Check that each point matches
// equals :: Coord ~> Coord -> Bool
Coord.prototype.equals = function (that) {
  return this.x === that.x
      && this.y === that.y
      && this.z === that.z
}

// Check each Coord with Coord.equals
// equals :: Line ~> Line -> Bool
Line.prototype.equals = function (that) {
  return this.from.equals(that.from)
      && this.to.equals(that.to)
}

// The this' "true-ness" must match that's!
// equals :: Bool ~> Bool -> Bool
Bool.prototype.equals = function (that) {
  return this.is(Bool.True) === that.is(Bool.True)
}

// Check the lists' heads, then their tails
// equals :: Setoid a => List a ~> List a -> Bool
List.prototype.equals = function (that) {
  return this.cata({
    // Note the two different Setoid uses:
    Cons: (head, tail) => head.equals(that.head) // a
        && tail.equals(that.tail), // List a

    Nil: () => that.is(List.Nil),
  })
}

// listOfCoords :: List Coord
const listOfCoords = List.from([Coord(1, 2, 3), Coord(4, 5, 6)])
const differentListOfCoords = List.from([Coord(3, 2, 1), Coord(6, 5, 4)])

console.log(listOfCoords.equals(listOfCoords))
console.log(listOfCoords.equals(differentListOfCoords))

// so we can also give Array this 'equals' method!
// provided of course that the elements in the array are all setoids

/* eslint-disable no-extend-native */
// equals :: Setoid a => [a] ~> [a] -> Bool
Array.prototype.equals = function (that) {
  if (this.length !== that.length) return false
  const areEqual = (x, y) => (x.equals && y.equals ? x.equals(y) : x === y)
  const isTrue = x => x === true
  return zipWith(areEqual)(this, that).every(isTrue)
}

console.log([1, 2].equals([1, 2]))
console.log([1, 2].equals(['a', 'b']))

// this is actually zind of powerful in that it works even for nested structures!
const nested = [[1, 2], 'a', [['b'], 3]]
console.log(nested.equals(nested))

// notEquals :: Setoid a => a -> a -> Bool
const notEquals = x => y => !x.equals(y)

// now that we have a formal definition for this data structure we can
// create sensible interfaces for working with all sorts of data

// consider a function that removes duplicates from an array
// naively we might write the function like this:
const nub = xs => xs.filter((x, i) => xs.indexOf(x) === i)

// or back at Concentra I think I did something like this
const nub2 = xs => [...new Set(xs)]

// given what we've done with the imnplementation of .equals on Array
// it is not difficult to see what is wrong with these implementations of nub
// we see that they do not really know how to handle non primitives correctly
// this is because non primitive data structures do not necesserally conform to Setoid spec
// because a suitible equals method is not provided natively

// however if we give our nub the appropriate type constraint...

// indexOf :: Setoid a => [a] -> a -> Int
const indexOf = xs => (x) => {
  for (let i = 0; i < xs.length; i += 1) {
    if ((xs[i].equals && xs[i].equals(x)) || xs[i] === x) return i
  }
  return -1
}

// nub3 :: Setoid a => [a] -> [a]
const nub3 = xs => xs.filter((x, i) => indexOf(xs)(x) === i)

// * Exercises

// I had to implement the reverse and push methods for this:
// isPalindrome :: Setoid a => List a -> Boolean
const isPalindrome = list => list.equals(list.reverse())

console.log(
  'palindome should be true',
  isPalindrome(List.from([Bool.True, Bool.False, Bool.True])),
)
console.log(
  'palindome should be false',
  isPalindrome(List.from([Bool.True, Bool.False])),
)

// and the other one was to build a set type
// a set can be considered to be a collection of unique elements
// where no two elements are equal
