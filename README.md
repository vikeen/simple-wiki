[![Build Status](https://travis-ci.org/vikeen/simple-wiki.svg)](https://travis-ci.org/vikeen/simple-wiki)

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

@TODO

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
