// filter :: Predicate a -> [a] ->  [a]
const filter = p => (xs) => {
  const res = []
  for (let i = 0; i < xs.length; i += 1) {
    const x = xs[i]
    if (p.f(x)) res.push(x)
  }
}

module.exports = { filter }
