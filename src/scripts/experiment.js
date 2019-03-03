const { Identity } = require('../algebraic-data-structures/index')

const { log } = console

const F = Identity

const add = a => b => a + b
const square = a => a * a

log(Identity.of('Paul'))
log(
  Identity.of(3)
    .map(square)
    .map(add(1)),
)
log(Identity.of(square))
log(Identity.of(2).chain(two => Identity.of(3).map(add(two))))

// F.of(x).map(f) === F.of(f).ap(F.of(x));

log(
  F.of(3).map(square),
)
log(
  F.of(square).ap(F.of(3)),
)
