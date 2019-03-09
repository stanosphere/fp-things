const assert = require('assert')
const Num = require('../Num')

const {
  addToArray,
  includes,
  insertInSortedArray,
  numbersToNums,
  removeDuplicates,
  sortArrayOfOrds,
} = require('../helpers.js')

describe('helpers', () => {
  // addToArray :: Setoid a => a -> [a] -> [a]
  describe('addToArray', () => {
    it('should add an element to an array if that element does not already exist', () => {
      const arr = numbersToNums([1, 2, 3, 5, 8, 13])
      const arrWithAddedElement = numbersToNums([1, 2, 3, 5, 8, 13, 21])
      assert.deepStrictEqual(addToArray(Num(21))(arr), arrWithAddedElement)
    })
    it('should not add an element to an array if that element does already exist', () => {
      const arr = numbersToNums([1, 2, 3, 5, 8, 13])
      assert.deepStrictEqual(addToArray(Num(13))(arr), arr)
    })
  })

  describe('includes', () => {
    // includes :: Setoid a => a -> [a] -> Bool
    it('should return true if an element is included', () => {
      const arr = numbersToNums([1, 2, 3, 5, 8, 13])
      assert.deepStrictEqual(includes(Num(13))(arr), true)
    })
    it('should return false if an element is not included', () => {
      const arr = numbersToNums([1, 2, 3, 5, 8, 13])
      assert.deepStrictEqual(includes(Num(21))(arr), false)
    })
  })

  describe('removeDuplicates', () => {
    // removeDuplicates :: Setoid a => [a] -> [a]
    it('should remove the duplicates from an array', () => {
      const arr = numbersToNums([2, 3, 1, 1, 5, 8])
      const noDups = numbersToNums([2, 3, 1, 5, 8])
      assert.deepStrictEqual(removeDuplicates(arr), noDups)
    })
    it('should do nothing to an array where all items are indeed unique', () => {
      const arr = numbersToNums([1, 2, 3, 5, 8, 13])
      assert.deepStrictEqual(removeDuplicates(arr), arr)
    })
  })

  describe('insertInSortedArray', () => {
    // insertInSortedArray :: Ord a => a -> [a] -> [a]
    it('given a sorted array it should insert an element at the front if the element is smaller than everything', () => {
      const sortedArr = numbersToNums([1, 2, 3, 4])
      assert.deepStrictEqual(
        insertInSortedArray(Num(0))(sortedArr),
        numbersToNums([0, 1, 2, 3, 4]),
      )
    })
    it('given a sorted array it should insert an element at the end if the element is bigger than everything', () => {
      const sortedArr = numbersToNums([1, 2, 3, 4])
      assert.deepStrictEqual(
        insertInSortedArray(Num(5))(sortedArr),
        numbersToNums([1, 2, 3, 4, 5]),
      )
    })
  })

  describe('sortArrayOfOrds', () => {
    // sortArrayOfOrds :: Ord a => a -> [a] -> [a]
    it('given a sorted array of Ords it should return the very same array', () => {
      const arr = numbersToNums([1, 2, 3, 4])
      assert.deepStrictEqual(
        sortArrayOfOrds(arr),
        arr,
      )
    })
    it('given an unsorted array of Ords it should return a sorted array', () => {
      const arr = numbersToNums([2, 4, 1, 3])
      const sortedArr = numbersToNums([1, 2, 3, 4])
      assert.deepStrictEqual(
        sortArrayOfOrds(arr),
        sortedArr,
      )
    })
    it('given a maximally unsorted array of Ords it should return a sorted array', () => {
      const arr = numbersToNums([4, 3, 2, 1])
      const sortedArr = numbersToNums([1, 2, 3, 4])
      assert.deepStrictEqual(
        sortArrayOfOrds(arr),
        sortedArr,
      )
    })
  })
})
