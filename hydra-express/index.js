const HydraExpressPlugin = require('hydra-express/plugin');

class HydraLogglyPlugin extends HydraExpressPlugin {
  constructor(config = {}) {
    super('hydra-plugin-loggly');
    this.config = config;
  }

  setHydraExpress(hydraExpress) {
    this.hydra = hydraExpress.getHydra();
    this.hydraExpress = hydraExpress;
    this.setHydra(this.hydra);
  }

  onServiceReady() {
    this.hydraExpress.log = require('../logger')(this.hydra, this.config);
    this.hydraExpress.appLogger = this.hydraExpress.log;
  }
}

module.exports = HydraLogglyPlugin;
