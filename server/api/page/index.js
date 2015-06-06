'use strict';

var express = require('express');
var controller = require('./page.controller.js');

var router = express.Router();

router.get('/', controller.index);
router.get('/:name', controller.show);

router.post('/', controller.create);

module.exports = router;
