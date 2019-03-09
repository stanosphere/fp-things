const {
  List, Num,
} = require('../algebraic-data-types/index')

// This is a fairly obvious extension of our beloved Setoid
// Basically we implement a methofd to compare sizes of Ords

// - this version of Ord shall implement lte
// (stands for less than or equal to)
// -- lte :: Ord a => a ~> a -> Boolean
// We could have used any of the 4 (<=, <, >, >=)
// Without loss of generality we choose lte

// it also satisfies some laws. here they are
// Suppose that a, b, and c are Ords
// -- (Ord a, Ord b, Ord b => ...)

// - Totality
// -- a.lte(b) || b.lte(a) === true

// - Antisymmetry
// -- a.lte(b) && b.lte(a) === a.equals(b)

// - Transitivity
// -- a.lte(b) && b.lte(c) === a.lte(c)
// basically tells us you can always aranged Ords in some order

// in fact we can implement any of the above inequalities once we define lte
// and since all Ords are Setoids we can also define an equals function

// lte :: Ord a => a -> a -> Boolean
const lte = (x, y) => x.lte(y)

// equals :: Setoid a => a -> a ~> Bool
const equals = (x, y) => x.equals(y)

// Greater than. The OPPOSITE of lte.
// gt :: Ord a => a -> a -> Boolean
const gt = (x, y) => !lte(x, y)

// Greater than or equal.
// gte :: Ord a => a -> a -> Boolean
const gte = (x, y) => gt(x, y) || equals(x, y)

// Less than. The OPPOSITE of gte!
// lt :: Ord a => a -> a -> Boolean
const lt = (x, y) => !gte(x, y)

// It is interesting to consider what the laws would be
// if we decided to construct our Ord type from one of the
// other 3 inequalities.

// Now, let's make our linked list into an Ord
// Recursive Ord definition for List!
// lte :: Ord a => [a] ~> [a] -> [a]
List.prototype.lte = function (that) {
  return this.cata({
    Cons: (thisHead, thisTail) => that.cata({
      Cons: (thatHead, thatTail) => (
        thisHead.equals(thatHead)
          ? lte(thisTail, thatTail)
          : lte(thisHead, thatHead)
      ),
      Nil: () => false,
    }),
    Nil: () => true,
  })
}

// let's look at an example of using this
const one = List.from([Num(1)])
const oneTwo = List.from([Num(1), Num(2)])

console.log(one)
console.log(oneTwo)

console.log('List 1 <= List 1 2?', lte(one, oneTwo))
console.log('List 1 2 <= List 1?', lte(oneTwo, one))
