const daggy = require('daggy')
const List = require('./List')

const OrderedList = daggy.taggedSum('OrderedList', {
  Cons: ['head', 'tail'], Nil: [],
})

OrderedList.empty = List.empty

// from :: OrderedList ~> Array a -> OrderedList a
OrderedList.from = function (xs) {
  return xs.reduceRight(
    (list, elem) => OrderedList.Cons(elem, list),
    OrderedList.Nil,
  )
}

module.exports = OrderedList
