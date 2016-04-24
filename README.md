[![Build Status](https://travis-ci.org/vikeen/simple-wiki.svg?branch=master)](https://travis-ci.org/vikeen/simple-wiki)

[![NPM](https://nodei.co/npm/simple-wiki.png?downloads=true)](https://nodei.co/npm/simple-wiki/)

# Simple Wiki
  Simple file system based wiki for Nodejs.

## Installation

`npm install simple-wiki`

## Usage

```javascript
var path = require('path'),
    simpleWiki = require('simple-wiki');

// required for page storage
simpleWiki.pagePath = path.join(__dirname, 'pages');

// port - 9000
// ip   - 127.0.0.1 (http://localhost)
simpleWiki.server.start(); 
```

## Configuration

#### pagePath (*String*)
- Absolute file system path for your wiki pages.
- ***Required***

```javascript
// Using nodejs path module
simpleWiki.pagePath = path.join(__dirname, 'pages');

// Or as a constant string
simpleWiki.pagePath = '/absolute/path/to/page/storage/directory/';
```
<br/>
#### faviconPath (*String*)
- Absolute file system path for your favicon image.

```javascript
// Using nodejs path module
simpleWiki.faviconPath = path.join(__dirname, 'favicon.ico');

// Or as a constant string
simpleWiki.faviconPath = '/absolute/path/to/favicon.ico';
```
<br/>
#### info (*Function*)
- Returns the current simple-wiki configuration

```javascript
var config = simpleWiki.info();
console.log(config);

/*
 {
   env: 'production',
   root: '/Users/me/dev/simple-wiki/dist/',
   faviconPath: undefined,
   pagePath: '/Users/me/dev/simple-wiki-sandbox/pages',
   server: {
     port: 9000,
     ip: '127.0.0.1',
     start: [Function: start]
   },
   info: [Function: info]
 }
 */
```
<br/>
#### server.port (*Integer*)
- The port which you want the wiki to run on. **Default: 9000**.

```javascript
// Default is 9000
simpleWiki.server.port = 9001;
```
<br/>
#### server.ip (*String*)
- The ip which you want the wiki to run on. **Default: 127.0.0.1**

```javascript
// Default is 127.0.0.1
simpleWiki.server.ip = '130.541.7.6';
```
<br/>
#### server.start (*Function*)
- Starts the simple-wiki server

```javascript
// Using nodejs path module
simpleWiki.server.start();
```

## FAQ

Q. **I found a bug. Where should I log it?**

A. You can log issues [here](https://github.com/vikeen/simple-wiki/issues). Please do us a favor and search before creating a new ticket to reduce duplicate overhead.


Q. **What can I expect in the future?**

A. Tons of things! Here is a sneak peak of the roadmap.
 - Page versioning via git
 - Custom page templates
 - Custom css themes
 - Enhanced document content types
 - Embedded table of contents
 - Internal autocomplete links
 - Other storage mechanisms (considering database here)

## Development

**Fork and clone the source locally**
- fork and clone the source
 - `git clone forked_simple-wiki`
- Install depencies
 - `npm install && bower install`
- Get going!
 - `grunt serve`

**Integrate as a third party user**

- Create sandbox project
  - `mkdir simple-wiki-sandbox && cd $_`
- Create init node_modules.
  - `mkdir node_modules`
- Create the server file to start simple-wiki.
  - `touch app.js`. The contents of this file should look similar to the [usage](#Usage) instructions above.
- Link the sandbox to our source code.
  - `ln -sf ../simple-wiki node_modules`

This will connect a development instance of simple-wiki to a user's production product. Because this is being connected via a node_module `require` it will also internally user the `dist/` of simple-wiki. This means that any change you make to the simple-wiki source will require a `grunt build` to see it in the sandbox area.

## Maintainers

[vikeen](https://github.com/vikeen)

## History

1.2.2
 - Adding test suite support for internal and external configuration settings

1.2.1
 - Added views meta data to pages. This feature has regression support in the source and test suite so don't worry about anything breaking on an update
