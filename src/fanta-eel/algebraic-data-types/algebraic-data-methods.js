// concat satisfies Associativity
// concat :: SemiGroup a => a -> a -> a
const concat = x => y => x.concat(y)

// empty satisfies Left Identity and Right Identity
// empty :: Monoid m => () -> m -> m
const empty = () => x => x.empty()

// equals satisfies Reflexivity, Symmetry, and Transistivity
// equals :: Setoid a => a -> a -> Boolean
const equals = x => y => x.equals(y)

// lte satisfies Totality, Antisymmetry, and Transitivity
// lte :: Ord a => a -> a -> Boolean
const lte = x => y => x.lte(y)

// map satisfies Identity and Composition
// map :: Functor f => (a -> b) -> f a -> f b
const map = fn => u => u.map(fn)

module.exports = {
  concat,
  empty,
  equals,
  lte,
  map,
}
