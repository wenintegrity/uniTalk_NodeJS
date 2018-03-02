module.exports = {
  validPostCalc: (check) => {
    return [
      check('data.data_1')
        .exists()
        .not().isEmpty()
        .custom(value => {
          return value.length === 2048
        }),
      check('data.data_2')
        .exists()
        .not().isEmpty()
        .custom(value => {
          return value.length === 2048
        }),
      check('data.data_3')
        .exists()
        .not().isEmpty()
        .custom(value => {
          return value.length === 2048
        }),
      check('id')
        .exists()
        .not().isEmpty(),
      check('location.latitude')
        .exists()
        .not().isEmpty(),
      check('location.longitude')
        .exists()
        .not().isEmpty(),
      check('time')
        .exists()
        .not().isEmpty()
    ]
  }
}
