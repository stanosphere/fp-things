const { Either } = require('../algebraic-data-types/functors/index')
// We're finally here, at the first scary sounding one!
// As well as the ususal blo post, the following resource exists:
// http://www.tomharding.me/2016/12/31/yippee-ki-yay-other-functors/

// - a Functor implements map
// -- map :: Functor f => f a ~> (a -> b) -> f b

// It satisfies the identity composition laws
// suppose m is a Monoid
// -- Functor u => ...

// - Identity
// -- u.map(x => x) === u

// - Composition:
// -- u.map(f).map(g) === u.map(x => g(f(x))) === u.map(compose(g, f))

// a call to map must return an identical outer structure
// with the inner value(s) transformed
// map basically gets passed into via the context of tghe container
// functors transform values with context

// Our functor is the first type which must contain something
// It must contain some other type
// It is perfectly reasonable for something like a String or Number
// to be a Setoid, Ord, Monoid and Semigroup
// These strings need not contain anything
// I need to stare at some of my semigroups and monoids now

// The conclusion of my quick look is that semigroups and monoids can contain values
// But they don't *need* to!

// After that brief digression
// All functors are container types
// Not all containber types are functors

// - lifting
// when a value is put into a functor it is said to be lifted into the functor

// - Common examples
// -- Maybe a, Represent a possibly null value.
// -- Either e a, Represent a value or exception.
// -- Array a, Represent a number of values.
// -- Function: x -> a, Represent a mapping to values.

// Now seems like a suitable time to go through the other article and
// explore some of these examples in more detail

// Either is kind of special because it holds two values simultaneously
// It's essentially a try-catch but much nicer!
// Let's look at it in action

// Either.of is essentially a way of handling possibly null things
console.log(Either.of(1, 2).toString())

// so what in the hell is the point of this?
// Here is why we like it:

// getLight :: Int -> Either String String
const getLight = i => Either.of(
  `${i} is not a valid choice!`,
  ['Red', 'Amber', 'Green'][i],
)

// getLight :: Int -> String
const transformLight = i => getLight(i)
  .map(x => x.toUpperCase())
  .map(x => `The light is ${x}`)
  .fold(
    e => `ERROR: ${e}`,
    s => `SUCCESS: ${s}`,
  )

// In this rather contrived example the Either has handled null values for us
// It means that we can do different behaviours for different events
// But not need to worry about nulls until the very end
// This sort of structure is perfect for error handling
// The reason this works is that once the left side has been reached there
// is no going back and any attempts to map just leave the value alone until we fold
// This is somewhat akin to how the Maybe functor works but rather than having
// Nothing, we have something that we can process like an error message!
// Beautiful
// This reminds me a little of the promise catch method
// But kind of the other way around

console.log(transformLight(2))
console.log(transformLight(4))

// the only other thing I need to do with Either is convince myself that
// it does indeed satisfy the Functor laws!
