const daggy = require('daggy')

// Semigroups are things that can be combined with each other
// For example `String` and `Array` are both SemiGroups because they both implement `concat`
// I think numbers might be as well but kind of in two senses
// Like you can combine them using * or +. But I could be wrong!

// - A SemiGroup implements concat
// -- concat :: Semigroup a => a ~> a -> a

// Suppose tha a, b, and c are SemiGroups
// -- (SemiGroup a, SemiGroup b, SemiGroup c => ...)
// The only law that concat must obey is:
// - Associativity
// -- a.concat(b).concat(c) === a.concat(b.concat(c))

const concat = (x, y) => x.concat(y)

// This is literally the same as the familiar maths definition
// It's so lovely and general!
// The way that the actual concating works is merely an implementation detail
// As alwasy the important bit is that law is obeyed!

// So I was right about the numbers thing.
// Lets create some semigroups for numbers!

const Sum = daggy.tagged('Sum', ['val'])

Sum.prototype.concat = function (that) {
  return Sum(this.val + that.val)
}

const Product = daggy.tagged('Product', ['val'])

Product.prototype.concat = function (that) {
  return Product(this.val * that.val)
}

const Min = daggy.tagged('Min', ['val'])

Min.prototype.concat = function (that) {
  return Min(Math.min(this.val, that.val))
}

const Max = daggy.tagged('Max', ['val'])

Max.prototype.concat = function (that) {
  return Min(Math.max(this.val, that.val))
}

console.log('I hope this is 5', Sum(2).concat(Sum(3)).val)
console.log('I hope this is 6', Product(2).concat(Product(3)).val)
console.log('I hope this is 2', Min(2).concat(Min(3)).val)
console.log('I hope this is 3', Max(2).concat(Max(3)).val)

// I wonder if I could generalise this
// perhaps have my Num type take a concat in its constructor
// and then it is a general semi group

// Also perhaps when we come on to natural trnasformations
// these guys would be a nice simple starting point

// here are some that contain booleans

const Any = daggy.tagged('Any', ['val'])

Any.prototype.concat = function (that) {
  return Any(this.val || that.val)
}

const All = daggy.tagged('All', ['val'])

All.prototype.concat = function (that) {
  return All(this.val && that.val)
}

console.log('I hope this is true', Any(true).concat(Any(false)).val)
console.log('I hope this is true', All(true).concat(All(true)).val)

// Here are some weird abstract containers for any value

const First = daggy.tagged('First', ['val'])

// Return the a value in a.concat(b)
First.prototype.concat = function () {
  return this
}

const Last = daggy.tagged('Last', ['val'])

// Return the b value in a.concat(b)
Last.prototype.concat = function (that) {
  return that
}

// We could promote a set to a semi group
// Thye obvious way I thought of was the union
// but also we could define concat to take the intersection!

// Now let's consider semiGroups with constraints
// Here is one where we require the contents of the SemiGroup to also be SemiGroups
// Note that the first and last elements of a Tuple can be different types

const Tuple = daggy.tagged('Tuple', ['x', 'y'])

// concat :: (Semigroup a, Semigroup b) => Tuple a b ~> Tuple a b -> Tuple a b
Tuple.prototype.concat = function (that) {
  return Tuple(
    this.x.concat(that.x),
    this.y.concat(that.y),
  )
}
console.log('I hope this is: Tuple(Sum(3), Any(true))')
console.log(Tuple(Sum(1), Any(false)).concat(Tuple(Sum(2), Any(true))).toString())

// inspecting the above, it becomes fairly obvious that we can define concat
// for longer tuples like:

const Tuple4 = daggy.tagged(
  'Tuple4', ['w', 'x', 'y', 'z'],
)

// concat :: (Semigroup a, Semigroup b, Semigroup c, Semigroup d) =>
//  Tuple4 a b c d ~> Tuple4 a b c d -> Tuple4 a b c d
Tuple4.prototype.concat = function (that) {
  return Tuple4(
    this.w.concat(that.w),
    this.x.concat(that.x),
    this.y.concat(that.y),
    this.z.concat(that.z),
  )
}

console.log('I hope this is: Tuple4(Sum(3), Min(3), Max(19), Product(36))')
console.log(
  Tuple4(
    Sum(1),
    Min(12),
    Max(4),
    Product(3),
  )
    .concat(
      Tuple4(
        Sum(2),
        Min(3),
        Max(19),
        Product(12),
      ),
    )
    .toString(),
)

// This is all well and good but what in the hell is the point of it all?
// Well let's think about merging things like real data
// So we choose a weird nested structure like so:

const Customer = daggy.tagged(
  'Customer',
  [
    'name', // :: String
    'favouriteThings', // :: [String]
    'registrationDate', // :: Int
    'hasMadePurchase', // :: Bool
  ],
)

// Now consider having duplicate customer records.
// fuck
// not to worry! SemiGroups might rescue us
// here is a naive implementation of a possible concat method
// it is disgusting and makes my eyes hurt

Customer.prototype.concat = function (that) {
  return Customer(
    this.name,
    this.favouriteThings.concat(that.favouriteThings),
    Math.min(this.registrationDate, that.registrationDate),
    this.hasMadePurchase || that.hasMadePurchase,
  )
}

// of course it is a perfectly valid way of doing it
// but if we recall our Tuple4 which had some sexy constraints on it
// if I was feeliong mathematical I might say that Customer is isomorphic to Tuple4
// so let's try to implement something that gives us the ability to choose merge strategies

// first let's find a way to convert a Customer to a Tuple4
// and back again!

const myStrategy = {
  // to :: Customer -> Tuple4 (First String) [String] (Min Int) (Any Bool)
  to: customer => Tuple4(
    First(customer.name),
    customer.favouriteThings,
    Min(customer.registrationDate),
    Any(customer.hasMadePurchase),
  ),
  // from :: Tuple4 (First String) [String] (Min Int) (Any Bool) -> Customer
  from: ({
    w, x, y, z,
  }) => Customer(w.val, x, y.val, z.val),
}

// merge :: Semigroup m => { to :: a -> m, from :: m -> a } -> a -> a -> a
const merge = ({ from, to }) => (cX, cY) => from(concat(to(cX), (to(cY))))

// just look at how sexy the above function is
// It just required that we trnsform our business logic into something semigroup
// The complexity comes from the fact that a customer is not automatically a semi group
// This complexity is all handled by the myStrategy object

// the joy of our merge function is it will work on ANY type, not just customer
// this is expressed in the type signature
// we see that a and m are both free type variables

// so let's test it!

const paulOne = Customer('paul', ['video games', 'js'], 100, true)
const paulTwo = Customer('mr stanford', ['cats', 'coffee'], 30, false)

console.log('The following should be: Customer("paul", ["video games", "js", "cats", "coffee"], 30, true)')
console.log(merge(myStrategy)(paulOne, paulTwo).toString())
console.log('The following should be: Customer("mr stanford", ["cats", "coffee", "video games", "js"], 30, true)')
console.log(merge(myStrategy)(paulTwo, paulOne).toString())

// looking at the above we notice an important property of semigroups
// they are not nececerilly commutative

// ok, so supose we wanted to do the above to many things? What would we do?
// We could reduce over the them of course!
// However we have not yet unlocked the Foldable type so watch this space!
