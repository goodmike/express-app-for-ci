const express = require('express');
const router = express.Router();

const knex = require('../db/knex.js');

router.get('/', function (req, res, next) {
  knex('users').select('*')
    .then((users) => res.status(200).json({status: 'success', data: users}))
    .catch((err) => res.status(500).json({status: 'error', data: err}));
});

module.exports = router;
