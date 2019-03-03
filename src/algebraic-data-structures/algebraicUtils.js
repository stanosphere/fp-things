const { Left } = require('./index')

// map :: Functor f => (a -> b) -> f a -> f b
const map = fn => f => f.map(fn)

// chain :: monad m => (a -> m b) -> m a -> m b
const chain = fn => m => m.chain(fn)

// join :: monad m => m (m a) -> m a
const join = m => m.join()

// sequence :: (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
const sequence = of => f => f.sequence(of)

// traverse :: (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
const traverse = of => fn => f => f.traverse(of, fn)

// left :: a -> Left a
const left = x => new Left(x)

module.exports = {
  chain,
  join,
  left,
  map,
  sequence,
  traverse,
}
