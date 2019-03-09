const assert = require('assert')
const { equals } = require('../algebraic-data-methods')

// assertEquals :: Setoid a, Setaoid b => b a -> b a -> Void
const assertEquals = (x, y) => assert.deepStrictEqual(equals(x)(y), true)

module.exports = { assertEquals }
