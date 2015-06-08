var config = require('./config');

var simpleWikiConfig = {
  server: {
    ip: config.ip,
    port: config.port,
    start: start
  }
};

module.exports = simpleWikiConfig;

function start() {
  require('./server/app')(simpleWikiConfig);
}
