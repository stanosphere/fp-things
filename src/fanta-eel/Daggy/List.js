const daggy = require('daggy')

const List = daggy.taggedSum('List', {
  Cons: ['head', 'tail'], Nil: [],
})

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

// .= := =>> >>= =<< --> ->> ||= <> |> <| *** :< :> 9:45

// from :: List ~> Array a -> List a
List.from = function (xs) {
  return xs.reduceRight(
    (acc, x) => List.Cons(x, acc),
    List.Nil,
  )
}

// push :: List a ~> a -> List a
List.prototype.push = function (x) {
  return List.Cons(x, this)
}

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
    Cons: (x, acc) => [
      x, ...acc.toArray(),
    ],
    Nil: () => [],
  })
}

module.exports = List

// [3, 4, 5]
// console.log(
//   List.from([1, 2, 3])
//     .map(x => x + 2)
//     .toArray(),
// )
