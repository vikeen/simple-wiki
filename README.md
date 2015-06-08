[![Build Status](https://travis-ci.org/vikeen/simple-wiki.svg)](https://travis-ci.org/vikeen/simple-wiki)

[![NPM](https://nodei.co/npm/simple-wiki.png?downloads=true)](https://nodei.co/npm/simple-wiki/)

# Simple Wiki
  Simple file system based wiki for Nodejs.

## Installation

`npm install simple-wiki`

## Usage

```
var path = require('path'),
    simpleWiki = require('simple-wiki');

simpleWiki.pagePath = path.join(__dirname, 'pages');
simpleWiki.server.start(); // port:9000 ip:127.0.0.1
```

## Configuration

## FAQ

Q. Is this normal?

A. Yes. This is normal. Why ...

## Development

grunt stuff

##Maintainers

me
