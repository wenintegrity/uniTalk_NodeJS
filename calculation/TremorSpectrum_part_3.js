module.exports = (...arguments) => {
  let min_1 = null, min_2 = null, min_3 = null, min_4 = null

  arguments.forEach(ts => {
    ts.tables[0].correlation < min_1 || min_1 === null ? min_1 = ts.tables[0].correlation : null
    ts.tables[1].correlation < min_2 || min_2 === null ? min_2 = ts.tables[1].correlation : null
    ts.tables[2].correlation < min_3 || min_3 === null ? min_3 = ts.tables[2].correlation : null
    ts.tables[3].correlation < min_4 || min_4 === null ? min_4 = ts.tables[3].correlation : null
  })

  arguments.forEach(ts => {
    ts.tables[0].minCorrelation = min_1
    ts.tables[1].minCorrelation = min_2
    ts.tables[2].minCorrelation = min_3
    ts.tables[3].minCorrelation = min_4
  })

  arguments.forEach(ts => {
    ts.tables.forEach(table => {
      table.rectifiedCorr = table.correlation - table.minCorrelation + 1
    })
  })
}
