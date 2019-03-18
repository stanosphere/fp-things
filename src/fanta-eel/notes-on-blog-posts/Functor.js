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
