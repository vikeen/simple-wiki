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
  simpleWikiConfig.env = 'production';
  process.env.NODE_ENV = simpleWikiConfig.env;
  require('./server/app')(simpleWikiConfig);
}
