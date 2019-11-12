'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.findAll);
router.get('/:name/:id', controller.findById);
// router.get('/:name', controller.findByCount);
// router.get('/:name/:content/:sentence', controller.findBySentence);
module.exports = router;
