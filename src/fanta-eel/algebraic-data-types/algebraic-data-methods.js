// concat satisfies Associativity
// concat :: Semigroup a => a -> a -> a
const concat = x => y => x.concat(y)

// equals satisfies Reflexivity, Symmetry, and Transistivity
// equals :: Setoid a => a -> a -> Boolean
const equals = x => y => x.equals(y)

// lte satisfies Totality, Antisymmetry, and Transitivity
// lte :: Ord a => a -> a -> Boolean
const lte = x => y => x.lte(y)

module.exports = { concat, equals, lte }
