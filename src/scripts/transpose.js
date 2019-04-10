// I have a haskell implementation
// transpose :: [[a]] -> [[a]]
// transpose = foldr (zipWith (:)) (repeat [])

// repeat :: Integer -> a -> [a]
const repeat = n => (x) => {
  let res = []
  for (let i = 0; i < n; i += 1) res = [...res, x]
  return res
}

// reduce :: (a -> b -> a, a) -> [b] -> a
const reduce = (f, init) => xs => xs.reduce((x, y) => f(x)(y), init)

// append :: [a] -> a -> [a]
const append = x => y => x.concat(y)

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith = f => xs => (ys) => {
  const n = Math.min(xs.length, ys.length)
  const res = []
  for (let i = 0; i < n; i += 1) {
    const x = xs[i]
    const y = ys[i]
    res.push(f(x)(y))
  }
  return res
}

// transpose :: [[a]] -> [[a]]
const transpose = reduce(zipWith(append), repeat(100)([]))

// haskell is lazy though so this doesn't really work so well in JS land
// I've just used 100 to emulate an infinite array lol

console.log(transpose([[1, 2], [1, 2]]))
