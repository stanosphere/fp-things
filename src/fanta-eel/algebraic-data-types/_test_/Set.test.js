const { compose } = require('lodash/fp')
const assert = require('assert')
const PaulSet = require('../Set')
const Num = require('../Num')
const { numbersToNums } = require('../helpers')
const { assertEquals } = require('./testHelpers')

// So I'm going to roughly try and do some property based testing here
// the idea being to eventually use like js verify or something

// numbersToPaulSet :: [Number] -> PaulSet Num
const numbersToPaulSet = compose(PaulSet.from, numbersToNums)

// emptySet :: PaulSet ()
const emptySet = PaulSet.empty()

describe('PaulSet', () => {
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
      assertEquals(emptySet, PaulSet.from([]))
      assertEquals(PaulSet.from([]), emptySet)
    })
    it('a set created from an arbritary array of unique elements should have the same size as that array', () => {
      const arr = numbersToNums([1, 2, 3, 4, 5, 6])
      assert.deepStrictEqual(PaulSet.from(arr).cardinality(), arr.length)
    })
    it('creating a set from an array where all elements are equal should result in a set of one element', () => {
      const arr = numbersToNums([1, 1, 1, 1, 1, 1, 1, 1, 1])
      assert.deepStrictEqual(PaulSet.from(arr).cardinality(), 1)
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
      const someSet = numbersToPaulSet([3, 4, 2, 5])
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
      const someSet = numbersToPaulSet([1, 1, 2, 3, 5, 8])
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
      const someSet = numbersToPaulSet([1, 2, 3])
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
      const someSet = numbersToPaulSet([1, 1, 2, 3, 5, 8])
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
      const someSet = numbersToPaulSet([3, 4, 2, 5])
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
      const someSet = numbersToPaulSet([-1, 0, 1])
      const someMap = num => num.map(x => x * x)
      expect(someSet.map(someMap).cardinality())
        .toBeLessThanOrEqual(someSet.cardinality())
    })
    it('if the map is one to one the set size must remain constant', () => {
      const someSet = numbersToPaulSet([-1, 0, 1])
      const someOneToOneMap = num => num.map(x => x + 1)
      expect(someSet.map(someOneToOneMap).cardinality())
        .toBe(someSet.cardinality())
    })
  })

  describe('equals', () => {
    it('sets constructed from the same array must be equal', () => {
      const arr = [1, 1, 2, 3, 3, 5, 5, 5, 8, 13]
      assertEquals(numbersToPaulSet(arr), numbersToPaulSet(arr))
    })
    it('sets created in different orders but with the same elements', () => {
      const someSet = numbersToPaulSet([1, 1, 2, 3, 5, 8])
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
})
