// partition :: (a -> Bool) -> [a] -> [[a]]
const partition = p => xs => xs.reduce((parts, x) => (p(x)
  ? [parts[0], [x, ...parts[1]]]
  : [[x, ...parts[0]], parts[1]]),
[[], []])

// quickSort :: Ord a => [a] -> [a]
const quickSort = (xs) => {
  if (xs.length <= 1) return xs
  const [head, ...tail] = xs
  const [smaller, bigger] = partition(x => x > head)(tail)
  return [...quickSort(smaller), head, ...quickSort(bigger)]
}

module.exports = quickSort
