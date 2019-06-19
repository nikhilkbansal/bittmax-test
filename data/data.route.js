const express = require('express')
const router = express.Router();
const controller = require('./data.controller');
const { authorize } = require('./../middlewares')


router.route('/').get(authorize, controller.getData);

module.exports = router;