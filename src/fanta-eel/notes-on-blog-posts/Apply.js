/* eslint-disable no-extend-native */
const daggy = require('daggy')
const Task = require('data.task')

const show = x => console.log(x.toString())
// remember how functors are like functions but with context
// well applicatives are about going between the two

// - an Apply implements ap
// -- ap :: Apply f => f a ~> f (a -> b) -> f b

// if we just get rid of the fs then we see that the signature becomes:

// -- a -> (a -> b) -> b

// - Apply satisfies the composition law
// compose :: (b -> c) -> (a -> b) -> a -> c
const compose = f => g => x => f(g(x))

// COMPOSITION LAW
// -- x.ap(g.ap(f.map(compose))) === x.ap(g).ap(f)
// -- lift3(compose)(f)(g)(x) === x.ap(g).ap(f)

// The only thing this could possibly be is regular old function _application_
// so perhaps our Apply abstracts out the notion of function application

// well that was underwhelming
// let's try and apeal to intuition and define lift2

// lift2 :: Applicative u => (a -> b -> c) -> u a -> u b -> u c
const lift2 = func => apA => apB => apB.ap(apA.map(func))

// lift3 :: Applicative u => (a -> b -> c -> d) -> u a -> u b -> u c -> u d
const lift3 = func => apA => apB => apC => apC.ap(apB.ap(apA.map(func)))

// if we look carefully we see that lift 2 transforms a binary function that
// takes abritary types into
// a bninary function that takes Appyand returns an Apply

// lift2 lets us combine two separate wrapped values into one with a given function
// it abstaracts out the notion of wrapping and unwrapping for us
// thus making our ADTs easier to code with and reason about

// a Semigroup type allows us to merge values
// An Apply type allows us to merge contexts

const Identity = daggy.tagged('Identity', ['x'])

// map :: Identity a ~> (a -> b) -> Identity b
Identity.prototype.map = function (f) {
  return new Identity(f(this.x))
}

// ap :: Identity a ~> Identity (a -> b) -> Identity b
Identity.prototype.ap = function (b) {
  return new Identity(b.x(this.x))
}

// Identity(5)
show(lift2(x => y => x + y)(Identity(2))(Identity(3)))

// ap :: Array a ~> Array (a -> b) -> Array b
Array.prototype.ap = function (fs) {
  return [].concat(...fs.map(f => this.map(f)))
}

show([2, 3, 4].ap([x => `${x}!`]))

show([2, 3, 4]
  .ap([
    x => `${x}!`,
    x => `${x}?`,
  ]))

// the above is a cartessian product between the functions and the numbers

// same signature as zipWith but a different beast alltogether

// doubleLoop :: (a -> b -> c) -> [a] -> [b] -> c
const doubleLoop = f => xs => ys => lift2(f)(xs)(ys)

show(doubleLoop(x => y => x + y)([1, 2, 3])([1, 2, 3]))

// ap is map with a wrapped function

// I've turned my maybe into an Apply now!

// Task implements Apply

// Convert a fetch promise to a Task.
const getJSON = url => new Task((rej, res) => fetch(url).then(res).catch(rej))

const renderPage = users => (posts) => {
  /* Write some HTML with this data... */
}

// A Promise of a web page.
// page :: Task e HTML
const page = lift2(renderPage)(getJSON('/users'))(getJSON('/posts'))

// so all ap really does is let us combine wrapped things
// without ever worrying about unwrapping them
// which is actually kind of cool
