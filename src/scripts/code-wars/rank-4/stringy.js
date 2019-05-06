// compose :: (b -> c) -> (a -> b) -> a -> c
const compose = f => g => x => f(g(x))

// filter :: (a -> Bool) -> [a] -> [a]
const filter = p => xs => xs.filter(p)

// notEqual :: a -> a -> Bool
const notEqual = x => y => y !== x

// without :: a -> [a] -> [a]
const without = compose(filter)(notEqual)

// isEven :: Number -> Bool
const isEven = n => n % 2 === 0

// getMiddleLetter :: [Char] -> Char
const getMiddleLetter = str => (isEven(str.length)
  ? str[str.length / 2]
  : str[(str.length - 1) / 2])

// middlePermutation :: [Char] -> [Char]
const middlePermutation = (str) => {
  if (str.length === 1) return str
  const sorted = str.slice().sort()
  const mid = getMiddleLetter(sorted)
  return [
    mid,
    ...compose(middlePermutation)(without(mid))(sorted),
  ]
}

middlePermutation(['a', 'b', 'c'])
