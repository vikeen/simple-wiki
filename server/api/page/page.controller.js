'use strict';

var _ = require('lodash'),
  marked = require('marked'),
  fs = require('fs'),
  path = require('path');

module.exports = {
  create: create,
  index: index,
  show: show
};

function create(req, res) {
  console.log('create page for: ', req.body.name);
  res.send(200);
}

function index(req, res) {
  res.json([
    {
      name: 'Development Tools',
      info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
    }, {
      name: 'Server and Client integration',
      info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
    }, {
      name: 'Smart Build System',
      info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
    }, {
      name: 'Modular Structure',
      info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
    }, {
      name: 'Optimized Build',
      info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
    }, {
      name: 'Deployment Ready',
      info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
    }
  ]);
}

function show(req, res) {
  fs.readFile(path.join(req.simpleWiki.pagePath, req.params.name + '.md'), 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
      res.send(500);
    }
    res.send(marked(data));
  });
}
