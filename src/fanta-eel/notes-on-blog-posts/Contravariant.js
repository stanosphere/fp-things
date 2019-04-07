const daggy = require('daggy')
const { compose } = require('lodash/fp')

// So this is gonna be like a functor but not

// - a Contravariant implements contramap
// -- contramap :: f a ~> (b -> a) -> f b

// It satisfies the identity and composition laws
// suppose u is a Contravariant
// -- Contravariant u => ...

// - Identity
// -- U.contramap(x => x) === U

// - Composition:
// -- U.contramap(f).contramap(g) === U.contramap(x => f(g(x)))

// bizarely it looks like the arrow is the wrong way around
// looks like contramap might be able to undo the good work of our lovely functor
// a regular functor would be called a covariant functor using this language

// type Predicate a = a -> Bool
// The `a` is the *INPUT* to the function!
const Predicate = daggy.tagged('Predicate', ['f'])

// Make a Predicate that runs `f` to get
// from `b` to `a`, then uses the original
// Predicate function!
// contramap :: Predicate a ~> (b -> a) -> Predicate b
Predicate.prototype.contramap = function (f) {
  return Predicate(compose(this.f, f))
}

// isEven :: Predicate Int
const isEven = Predicate(x => x % 2 === 0)

// toLength :: String -> Int
const toLength = x => x.length

// Take a string, run .length, then isEven.
// lengthIsEven :: Predicate String
const lengthIsEven = isEven.contramap(toLength)

console.log(isEven.toString())
console.log(isEven.f(8))
console.log(lengthIsEven.f('even'))

// type ToString a :: a -> String
const ToString = daggy.tagged('ToString', ['f'])

// Add a pre-processor to the pipeline.
ToString.prototype.contramap = function (f) {
  return ToString(compose(this.f, f))
}

// Convert an int to a string.
// intToString :: ToString Int
const intToString = ToString(x => `int(${x})`)
  .contramap(x => x | 0) // Optional

// Convert an array of strings to a string.
// stringArrayToString :: ToString [String]
const stringArrayToString = ToString(x => `[ ${x} ]`)
  .contramap(x => x.join(', '))

// Given a ToString instance for a type,
// convert an array of a type to a string.
// arrayToString :: ToString a -> ToString [a]
const arrayToString = t => stringArrayToString
  .contramap(x => x.map(t.f))

// Convert an integer array to a string.
// intsToString :: ToString [Int]
const intsToString = arrayToString(intToString)

// Aaand they compose! 2D int array:
// matrixToString :: ToString [[Int]]
const matrixToString = arrayToString(intsToString)

// "[ [ int(1), int(2), int(3) ] ]"
console.log(matrixToString.f([[1, 2, 3], [4, 5, 6]]))

// type Experiment a :: a -> b
const Experiment = daggy.tagged('Experiment', ['f'])

Experiment.prototype.contramap = function (f) {
  return Experiment(compose(this.f, f))
}

const thing = Experiment(x => x + 1)
  .contramap(x => x * 2)
  .contramap(x => x * x)
  .f(2)

console.log(thing)

// so it seem that this is just map but in the opposite direction
// I wonder if we could have a contravariant whose 'f' is not a function?

// type Equivalence a = a -> a -> Bool
// `a` is the type of *BOTH INPUTS*!
const Equivalence = daggy.tagged('Equivalence', ['f'])

// Add a pre-processor for the variables.
Equivalence.prototype.contramap = function (g) {
  return Equivalence(
    (x, y) => this.f(g(x), g(y)),
  )
}

// Do a case-insensitive equivalence check.
// searchCheck :: Equivalence String
const searchCheck = Equivalence((x, y) => x === y)
  .contramap(x => x.replace(/\W+/, '')) // remove symbols
  .contramap(x => x.toLowerCase()) // lowercase

// And some tests...
searchCheck.f('Hello', 'HEllO!') // true
searchCheck.f('world', 'werld') // false

// as a final note, both equivalence and predicate are monoids!!

// It's like a function to our `All` monoid!
Predicate.prototype.empty = () => Predicate(() => true)

Predicate.prototype.concat = function (that) {
  return Predicate(x => this.f(x) && that.f(x))
}

// The possibilities, they are endless
Equivalence.prototype.empty = () => Equivalence(() => true)

Equivalence.prototype.concat = function (that) {
  return Equivalence((x, y) => this.f(x, y) && that.f(x, y))
}
