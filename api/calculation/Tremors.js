class Tremors {

    static getData(title3, title2, title1, data_3, data_2, data_1) {
        return [
            {
                title: title3,
                line9: {
                    value: data_3
                },
                line10: {
                    value: data_3 / data_2 * 100
                }
            },
            {
                title: title2,
                line9: {
                    value: data_2
                },
                line10: {
                    value: data_2 / data_1 * 100
                }
            },
            {
                title: title1,
                line9: {
                    value: data_1
                },
                line10: {
                    value: data_1 / data_1 * 100
                }
            }
        ];
    }

    static getResult(cells, index) {
        let amount = 0;

        for (let i = 0; i <= cells.length - 1; i++) {
            amount += cells[i][index].line10.value;
        }

        return (amount / cells.length) - 100;
    }
}


module.exports = Tremors;