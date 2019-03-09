const daggy = require('daggy')

const List = daggy.taggedSum('List', {
  Cons: ['head', 'tail'], Nil: [],
})

// empty :: List ~> () -> List ()
List.empty = function () {
  return List.Nil
}

// from :: List ~> Array a -> List a
List.from = function (xs) {
  return xs.reduceRight(
    (list, elem) => List.Cons(elem, list),
    List.Nil,
  )
}

// concat List a ~> List a -> List a
List.prototype.concat = function (that) {
  return this.cata({
    // :: (a , List a) -> List a
    Cons: (head, tail) => List.Cons(head, tail.concat(that)),
    Nil: () => that,
  })
}

// Check the lists' heads, then their tails
// equals :: Setoid a => List a ~> List a -> Bool
List.prototype.equals = function (that) {
  return this.cata({
    // :: (a , List a) -> Bool
    Cons: (head, tail) => head.equals(that.head)
      && tail.equals(that.tail),
    Nil: () => that.is(List.Nil),
  })
}

// isEmpty :: List a ~> () -> Bool
List.prototype.isEmpty = function () {
  return this.equals(List.empty())
}

// map :: List a ~> (a -> b) -> List b
List.prototype.map = function (f) {
  return this.cata({
    // :: (a , List a) -> List a
    Cons: (head, tail) => List.Cons(
      f(head), tail.map(f),
    ),
    Nil: () => List.Nil,
  })
}

// push :: List a ~> a -> List a
List.prototype.push = function (x) {
  return List.Cons(x, this)
}

// reverse :: List a ~> () -> List a
List.prototype.reverse = function () {
  let list = this
  let res = List.Nil
  while (!list.is) {
    const curr = list.head
    // I had to go back and define push on the 'List' prototype
    res = res.push(curr)
    list = list.tail
  }
  return res
}

// toArray :: List a ~> () -> Array a
List.prototype.toArray = function () {
  return this.cata({
    Cons: (head, tail) => [
      head, ...tail.toArray(),
    ],
    Nil: () => [],
  })
}

module.exports = List
