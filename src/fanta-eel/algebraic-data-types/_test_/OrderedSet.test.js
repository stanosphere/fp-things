const { compose } = require('lodash/fp')
const assert = require('assert')
const OrderedSet = require('../OrderedSet')
const Num = require('../Num')
const { numbersToNums, toNumber } = require('../helpers')
const { assertEquals, scramble } = require('./testHelpers')

// So I'm going to roughly try and do some property based testing here
// the idea being to eventually use like js verify or something

// numbersToOrderedSet :: [Number] -> OrderedSet Num
const numbersToOrderedSet = compose(OrderedSet.from, numbersToNums)

// emptySet :: OrderedSet ()
const emptySet = OrderedSet.empty()

describe('OrderedSet', () => {
  describe('empty', () => {
    it('should have cardinality of zero', () => {
      assert.deepStrictEqual(emptySet.cardinality(), 0)
    })
    it('should be equal to itself', () => {
      assertEquals(emptySet, emptySet)
    })
  })

  describe('from', () => {
    it('creating a set from an empty array should yield the empty set', () => {
      assertEquals(emptySet, OrderedSet.from([]))
      assertEquals(OrderedSet.from([]), emptySet)
    })
    it('a set created from an arbritary array of unique elements should have the same size as that array', () => {
      const arr = numbersToNums([1, 2, 3, 4, 5, 6])
      assert.deepStrictEqual(OrderedSet.from(arr).cardinality(), arr.length)
    })
    it('creating a set from an array where all elements are equal should result in a set of one element', () => {
      const arr = numbersToNums([1, 1, 1, 1, 1, 1, 1, 1, 1])
      assert.deepStrictEqual(OrderedSet.from(arr).cardinality(), 1)
    })
  })

  describe('has', () => {
    it('should have cardinality of zero', () => {
      // ...
    })
    it('should be equal to itself', () => {
      // ...
    })
  })

  describe('add', () => {
    it('must be idempotent', () => {
      const someSet = numbersToOrderedSet([3, 4, 2, 5])
      const someElement = Num(12)
      assertEquals(
        someSet
          .add(someElement),
        someSet
          .add(someElement)
          .add(someElement)
          .add(someElement)
          .add(someElement),
      )
    })
    it('must yield the same set no matter what order we add items in', () => {
      const someSet = numbersToOrderedSet([1, 1, 2, 3, 5, 8])
      const [a, b, c, d] = numbersToNums([13, 21, 34, 55])
      assertEquals(
        someSet
          .add(a)
          .add(b)
          .add(c)
          .add(d),
        someSet
          .add(d)
          .add(b)
          .add(c)
          .add(a),
      )
    })
  })

  describe('remove', () => {
    it('must be idempotent', () => {
      const someSet = numbersToOrderedSet([1, 2, 3])
      const someElement = Num(3)
      assertEquals(
        someSet
          .remove(someElement),
        someSet
          .remove(someElement)
          .remove(someElement)
          .remove(someElement)
          .remove(someElement),
      )
    })
    it('must yield the same set no matter what order we remove items in', () => {
      const someSet = numbersToOrderedSet([1, 1, 2, 3, 5, 8])
      const [a, b, c, d] = numbersToNums([8, 13, 21, 34])
      assertEquals(
        someSet
          .remove(a)
          .remove(b)
          .remove(c)
          .remove(d),
        someSet
          .remove(d)
          .remove(b)
          .remove(c)
          .remove(a),
      )
    })
  })

  describe('add and remove', () => {
    it('add followed by remove must yield the original set (if the element does not already exist in the set)', () => {
      const someSet = numbersToOrderedSet([3, 4, 2, 5])
      const someElement = Num(7)
      assertEquals(
        someSet
          .add(someElement)
          .remove(someElement),
        someSet,
      )
    })
  })

  describe('map', () => {
    it('map cannot yield a set with an increased cardinality', () => {
      const someSet = numbersToOrderedSet([-1, 0, 1])
      const someMap = num => num.map(x => x * x)
      expect(someSet.map(someMap).cardinality())
        .toBeLessThanOrEqual(someSet.cardinality())
    })
    it('if the map is one to one the set size must remain constant', () => {
      const someSet = numbersToOrderedSet([-1, 0, 1])
      const someOneToOneMap = num => num.map(x => x + 1)
      expect(someSet.map(someOneToOneMap).cardinality())
        .toBe(someSet.cardinality())
    })
  })

  describe('equals', () => {
    it('sets constructed from the same array must be equal', () => {
      const arr = [1, 1, 2, 3, 3, 5, 5, 5, 8, 13]
      assertEquals(numbersToOrderedSet(arr), numbersToOrderedSet(arr))
    })
    it('sets with the same content are equal', () => {
      const arr = [1, 1, 2, 3, 3, 5, 5, 5, 8, 13]
      assertEquals(
        compose(numbersToOrderedSet, scramble)(arr),
        numbersToOrderedSet(arr),
      )
    })
    it('sets created in different orders but with the same elements', () => {
      const someSet = numbersToOrderedSet([1, 1, 2, 3, 5, 8])
      const [a, b, c, d] = numbersToNums([13, 21, 34, 55])
      assertEquals(
        someSet
          .add(a)
          .add(b)
          .add(c)
          .add(d),
        someSet
          .add(d)
          .add(b)
          .add(c)
          .add(a),
      )
    })
    it('satisfies Transistivity', () => {
      // ...
    })
    it('satisfies Symmetry', () => {
      // ...
    })
    it('atisfies Reflexivity', () => {
      // ...
    })
  })

  describe('an ordered set must be ordered', () => {
    it('should automatically order the elements if constructed from a scrambled array', () => {
      const someNumbers = scramble([1, 4, 3, 5, 6, 7, 2])
      // want to compare [Number] to [Number]
      assert.deepStrictEqual(
        numbersToOrderedSet(someNumbers)
          .toArray()
          .map(toNumber),
        someNumbers.sort(),
      )
    })

    it('should automatically order the elements if if a new ordered set is produced via the map function', () => {
      const mapFn = x => 1 - x
      const someNumbers = scramble([1, 4, 3, 5, 6, 7, 2])
      // I'ts kind of annoying that I have to use map twice here
      const orderedSetConstructedByMapping = numbersToOrderedSet(someNumbers)
        .map(n => n.map(mapFn))
      // want to compare [Number] to [Number]
      assert.deepStrictEqual(
        orderedSetConstructedByMapping
          .toArray()
          .map(toNumber),
        someNumbers
          .map(mapFn)
          .sort((a, b) => a - b),
      )
    })
  })
})
