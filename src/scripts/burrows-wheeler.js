const compose = (...fs) => x => fs.reduceRight((res, f) => f(res), x)

// just puts the last element at the start and shifts everything else along
// shiftString :: Sting -> String
const shiftString = (str) => {
  const len = str.length
  const last = str.slice(len - 1, len)
  const start = str.slice(0, len - 1)
  return [last, ...start].join('')
}

// stringToMatrix :: String -> [String]
const stringToMatrix = (str) => {
  const res = []
  let curr = str
  for (let i = 0; i < str.length; i += 1) {
    res.push(curr)
    curr = shiftString(curr)
  }
  return res
}

// sortMatrix :: [String] -> [String]
const sortMatrix = matrix => matrix.sort()

// getLastColumn :: [String] -> String
const getLastColumn = matrix => matrix
  .map(str => str[str.length - 1])
  .join('')

// encode :: String -> [String, Number]
const encode = (str) => {
  const sortedMatrix = compose(sortMatrix, stringToMatrix)(str)
  return [getLastColumn(sortedMatrix), sortedMatrix.indexOf(str)]
}

// sortString :: String -> String
const sortString = str => str
  .split('')
  .sort()
  .join('')

// zipWith :: ((a, b) -> c) -> ([a] , [b]) -> [c]
const zipWith = zipper => (xs, ys) => {
  const n = Math.min(xs.length, ys.length)
  const res = []
  for (let i = 0; i < n; i += 1) {
    res.push(zipper(xs[i], ys[i]))
  }
  return res
}

// nub :: Setoid a => [a] -> [a]
const nub = xs => xs.filter((x, i) => xs.indexOf(x) === i)

// buildTree :: ([String], [[String, String]]) -> [String]
const buildTree = (pairs, num) => {
  // Node :: {
  //   word :: String
  //   value :: String
  //   depth :: Number
  //   potentialChildren :: [String]
  // }

  // toNode :: (String, String, Number) -> Node
  const toNode = (parent, value, depth) => ({
    word: value[1] + parent.word,
    value,
    depth,
    potentialChildren: parent
      .potentialChildren
      .filter((_, i) => i !== parent.potentialChildren.indexOf(value)),
    // only want to remove one child from the potential!
  })

  // the root's value may not be unique hence we use filter rather than nub
  // tree :: [Node]
  const tree = [{
    word: pairs[num][1],
    value: pairs[num],
    depth: 0,
    potentialChildren: pairs.filter((_, i) => i !== num),
  }]

  // build tree layer by layer
  for (let i = 0; i < pairs.length; i += 1) {
    const nodesAtCurrentDepth = tree.filter(nd => nd.depth === i)
    nodesAtCurrentDepth.forEach((nd) => {
      const children = nd.potentialChildren.filter(pair => pair[0] === nd.value[1])
      tree.push(...nub(children).map(child => toNode(nd, child, i + 1)))
    })
  }

  return tree
    .filter(nd => nd.depth === pairs.length - 1)
    .map(nd => nd.word)
}

// decode :: [String, Number] -> String
const decode = (str, num) => {
  const lastColumn = str
  const firstColumn = sortString(str)
  const pairs = zipWith((a, b) => a + b)(firstColumn, lastColumn)
  return buildTree(pairs, num)
    .find((ans) => {
      const [_str, _num] = encode(ans)
      return _str === str && _num === num
    })
};

[
  decode('nnbbraaaa', 4),
  decode('e emnllbduuHB', 2),
  decode('ww MYeelllloo', 1),
].forEach(x => console.log(x))

module.exports = { decode, encode }
