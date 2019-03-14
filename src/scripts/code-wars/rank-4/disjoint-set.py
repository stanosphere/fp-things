# https://en.wikipedia.org/wiki/Disjoint-set_data_structure

class DisjointSet(object):
  def __init__(self):
    self.rep = {}
    return 
  
  def parent(self, p):
    if not p in self.rep:
      return None
    if self.rep[p] == p:
      return p
    self.rep[p] = self.parent(self.rep[p])
    return self.rep[p]

  def union(self, p, q):
    if p not in self.rep:
      self.rep[p] = p
    if q not in self.rep:
      self.rep[q] = q
    self.rep[self.parent(q)] = self.parent(p)
    
  def connected(self, p, q):
    parentP, parentQ = self.parent(p), self.parent(q)
    return parentP != None and parentP == parentQ

res = DisjointSet()
res.union(4,3)
res.union(3,8)
res.union(6,5)
res.union(9,4)
res.union(2,1)

print(res.connected(1, 2))
print(res.connected(0, 7))