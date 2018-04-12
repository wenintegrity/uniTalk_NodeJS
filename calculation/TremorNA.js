class TremorNA {
  constructor (table_name, title_1, title_2, title_3, ...parametrs) {
    this.table_name = table_name

    this.cells = []

    parametrs.forEach(element => {
      this.cells.push(this.getData(title_1, title_2, title_3, element[0], element[1], element[2]))
    })

    this.result = [
      this.getResult(this.cells, 0),
      this.getResult(this.cells, 1)
    ]
  }

  getData (title_1, title_2, title_3, data_1, data_2, data_3) {
    return [
      {
        title: title_3,
        line9: {
          value: data_3
        },
        line10: {
          value: data_3 / data_2 * 100
        }
      },
      {
        title: title_2,
        line9: {
          value: data_2
        },
        line10: {
          value: data_2 / data_1 * 100
        }
      },
      {
        title: title_1,
        line9: {
          value: data_1
        },
        line10: {
          value: data_1 / data_1 * 100
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
