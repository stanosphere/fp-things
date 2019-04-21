// inspect :: a -> String
const inspect = (x) => {
  if (x && typeof x.inspect === 'function') {
    return x.inspect()
  }

  const inspectFn = f => f.name || f.toString()

  const inspectTerm = (t) => {
    switch (typeof t) {
      case 'string':
        return `'${t}'`
      case 'object': {
        const ts = Object.keys(t).map(k => [k, inspect(t[k])])
        return `{${ts.map(kv => kv.join(': ')).join(', ')}}`
      }
      default:
        return String(t)
    }
  }

  const inspectArgs = args => (Array.isArray(args) ? `[${args.map(inspect).join(', ')}]` : inspectTerm(args))

  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x)
}

module.exports = { inspect }
