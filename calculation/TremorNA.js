class TremorNA {
  constructor (table_name, ...parametrs) {
    this.table_name = table_name

    this.cells = []

    parametrs.forEach(values => {
      this.cells.push(this.getData(values))
    })

    this.result = [
      this.getResult(this.cells, 0),
      this.getResult(this.cells, 1)
    ]
  }

  getData ([value_1, value_2, value_3, title]) {
    return [
      {
        title: title,
        line9: {
          value: value_3
        },
        line10: {
          value: value_3 / value_2 * 100
        }
      },
      {
        title: title,
        line9: {
          value: value_2
        },
        line10: {
          value: value_2 / value_1 * 100
        }
      },
      {
        title: title,
        line9: {
          value: value_1
        },
        line10: {
          value: value_1 / value_1 * 100
        }
      }
    ]
  }

  getResult (cells, index) {
    let amount = 0

    for (let i = 0; i <= cells.length - 1; i++) {
      amount += cells[i][index].line10.value
    }

    return (amount / cells.length) - 100
  }
}

module.exports = TremorNA
