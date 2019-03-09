const { compose } = require('lodash/fp')
// const assert = require('assert')
const List = require('../List')
const { numbersToNums } = require('../helpers')
const { assertEquals } = require('./testHelpers')

// I think this just a natural trnasformation
// numbersToPaulSet :: Array Number -> List Num Number
const numbersToList = compose(List.from, numbersToNums)

const emptyList = List.empty()

describe('List', () => {
  describe('concat', () => {
    it('concating the empty list with any list should be equal to that list', () => {
      const anyList = numbersToList([1, 1, 2, 3, 5, 8, 13])
      assertEquals(emptyList.concat(anyList), anyList)
      assertEquals(anyList.concat(emptyList), anyList)
    })
    it('concating a pair of non empty list should work', () => {
      const start = numbersToList([1, 1, 2, 3])
      const finish = numbersToList([5, 8, 13])
      assertEquals(start.concat(finish), numbersToList([1, 1, 2, 3, 5, 8, 13]))
      assertEquals(finish.concat(start), numbersToList([5, 8, 13, 1, 1, 2, 3]))
    })
  })
})
