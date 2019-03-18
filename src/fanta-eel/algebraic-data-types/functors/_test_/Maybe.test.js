const assert = require('assert')
const Maybe = require('../Maybe')

const { Just, Nothing } = Maybe

// extractValue :: Maybe a -> a
const extractValue = m => m.val

/* eslint-disable no-void */

describe('Maybe', () => {
  describe('of', () => {
    it('should return Nothing if given null', () => {
      assert(Maybe.of(null).is(Nothing))
    })
    it('should return Nothing if given undefined', () => {
      assert(Maybe.of(undefined).is(Nothing))
      assert(Maybe.of(void 0).is(Nothing))
    })
    it('should return Just if given literally anything elese', () => {
      assert.deepStrictEqual(Maybe.of(1), Just(1))
      assert.deepStrictEqual(Maybe.of('1'), Just('1'))
      assert.deepStrictEqual(Maybe.of({ one: 1 }), Just({ one: 1 }))
      assert.deepStrictEqual(Maybe.of([1]), Just([1]))
      assert.deepStrictEqual(Maybe.of(true), Just(true))
      assert.deepStrictEqual(Maybe.of(Nothing), Just(Nothing))
      assert.deepStrictEqual(Maybe.of(Maybe.of(1)), Just(Maybe.of(1)))
    })
  })
  describe('map', () => {
    it('should return Nothing if Nothing is mapped over', () => {
      const anyFunction = x => x * x
      assert(Maybe.of(null).map(anyFunction).is(Nothing))
    })
    it('should return Nothing if the result of a map is null', () => {
      const resultIsNull = () => null
      assert(Maybe.of('not null').map(resultIsNull).is(Nothing))
    })
    it('should return Nothing if the result of a map is undefined', () => {
      const resultIsUndeined = () => undefined
      assert(
        Maybe
          .of('not undefined')
          .map(resultIsUndeined)
          .is(Nothing),
      )
    })

    it('should map in the ususal way if we don\'t encounter nulls or undefineds', () => {
      const toLength = str => str.length
      const square = x => x * x
      const toString = x => x.toString9
      assert.deepStrictEqual(
        extractValue(
          Maybe
            .of('I have a length of 21')
            .map(toLength)
            .map(square)
            .map(toString),
        ),
        `${21 * 21}`,
      )
    })
  })
})
