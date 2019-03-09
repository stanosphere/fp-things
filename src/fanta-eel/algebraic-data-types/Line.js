const daggy = require('daggy')

// Line :: (Coord, Coord) -> Line
const Line = daggy.tagged('Line', ['from', 'to'])

module.exports = Line
