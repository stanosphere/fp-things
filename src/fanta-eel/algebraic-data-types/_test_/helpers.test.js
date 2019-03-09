const assert = require('assert')
const Num = require('../Num')

const {
  addToArray,
  includes,
  numbersToNums,
  removeDuplicates,
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
})
