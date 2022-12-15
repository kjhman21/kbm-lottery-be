const router = require('express').Router();
const { DB } = require('../models');

var routes = [
  "admin",
  "mint",
  "list_uuid"
]

routes.forEach((r) => {
  router.use(`/${r}`, require(`./${r}`))
})

module.exports = router;