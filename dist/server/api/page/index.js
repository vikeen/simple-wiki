'use strict';

var express = require('express'),
  controller = require('./page.controller.js'),
  config = require('../../../config');

var router = express.Router(),
  options = {
    pagePath: config.pagePath
  };


router.get('/', function (req, res) {
  return controller.index(options)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});
router.get('/:title', function (req, res) {
  return controller.show(req.params.title, options)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

router.post('/', function (req, res) {
  return controller.create(req.body, options)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

router.put('/:title', function (req, res) {
  return controller.update(req.params.title, req.body, options)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
});

module.exports = router;
