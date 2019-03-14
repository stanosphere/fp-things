// This is just a direct copy of my python implementation of the same clss
// I want to make it into a functionally thing rather than a classy thing

class DisjointSet {
  constructor() {
    this.rep = {}
  }

  parent(item) {
    const { rep } = this

    if (rep[item] === undefined) return undefined
    if (rep[item] === item) return item
    rep[item] = this.parent(rep[item])
    return rep[item]
  }

  union(x, y) {
    const { rep } = this
    if (rep[x] === undefined) rep[x] = x
    if (rep[y] === undefined) rep[y] = y
    rep[this.parent(y)] = this.parent(x)
  }

  connected(x, y) {
    const pX = this.parent(x)
    const pY = this.parent(y)
    return pX !== undefined && pY !== undefined && pX === pY
  }
}

const areConnected = pairs => (x, y) => {
  const disjointSet = new DisjointSet()
  pairs.forEach(([u, v]) => disjointSet.union(u, v))
  return disjointSet.connected(x, y)
}

const res = new DisjointSet()
res.union(4, 3)
res.union(3, 8)
res.union(6, 5)
res.union(9, 4)
res.union(2, 1)

console.log(res.connected(1, 2))
console.log(res.connected(0, 7))
