const assert = require('assert')
const PaulSet = require('./Set')

// So I'm going to roughly try and do some property based testing here

// first define some helpers

// equals :: PaulSet a -> PaulSet a -> Bool
const equals = x => y => x.equals(y)

describe('PaulSet', () => {
  describe('empty', () => {
    const emptySet = PaulSet.empty()
    it('should have cardinality of zero', () => {
      assert.deepStrictEqual(emptySet.cardinality(), 0)
    })
    it('should be equal to itself', () => {
      assert.deepStrictEqual(equals(emptySet)(emptySet), true)
    })
  })

  describe('from', () => {
    it('creating a set from an empty array should yield the empty set', () => {
      const emptySet = PaulSet.empty()
      assert.deepStrictEqual(equals(emptySet)(PaulSet.from([])), true)
      assert.deepStrictEqual(equals(PaulSet.from([]))(emptySet), true)
    })
    it('a set created from an arbritary array of unique elements should have the same sizew as that array', () => {
      // ...
    })
    it('creating a set from an array where all elements are equal should result in a set of one element', () => {
      // ...
    })
  })
})
