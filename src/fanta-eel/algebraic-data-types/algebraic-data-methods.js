// ap satisfies Composition
// ap :: Apply f => f a -> f (a -> b) -> f b
const ap = x => fn => x.ap(fn)

// concat satisfies Associativity
// concat :: SemiGroup a => a -> a -> a
const concat = x => y => x.concat(y)

// contramap satisfies Identity and Composition
// contramap :: Contravariant u => (b -> a) -> u a -> u b
const contramap = fn => u => u.contramap(fn)

// empty satisfies Left Identity and Right Identity
// empty :: Monoid m => () -> m -> m
const empty = () => x => x.empty()

// equals satisfies Reflexivity, Symmetry, and Transistivity
// equals :: Setoid a => a -> a -> Boolean
const equals = x => y => x.equals(y)

// lift2 :: Applicative f => (a, b, c) -> f a -> f b -> f c
const lift2 = (f, a, b) => b.ap(a.map(f))

// lte satisfies Totality, Antisymmetry, and Transitivity
// lte :: Ord a => a -> a -> Boolean
const lte = x => y => x.lte(y)

// map satisfies Identity and Composition
// map :: Functor u => (a -> b) -> u a -> u b
const map = fn => u => u.map(fn)

module.exports = {
  ap,
  concat,
  contramap,
  empty,
  equals,
  lift2,
  lte,
  map,
}
