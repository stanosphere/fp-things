const daggy = require('daggy')

const Product = daggy.tagged('Product', ['val'])

// Product is a semigroup and a momoid

// empty :: () ~> Product Number
Product.empty = () => Product(1)

// concat :: Product Number ~> Product Number -> Product Number
Product.prototype.concat = function (that) {
  return Product(this.val * that.val)
}

module.exports = Product
