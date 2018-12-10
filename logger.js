module.exports = (hydra, config) => {
  const ServerRequest = require('./serverRequest');
  const Utils = hydra.getUtilsHelper();

  let serverRequest = new ServerRequest();
  if (config.loggly && config.loggly.protocol) {
    serverRequest.setProtocol(config.loggly.protocol);
  }

  /**
   * @name log
   * @summary logs a message
   * @param {string} type - type of message: 'info', 'debug', 'error', 'fatal' or other
   * @param {object / string} message - message to log
   * @return {undefined}
   */
  return (type, message) => {
    if (!hydra.initialized) {
      return;
    }
    if (!hydra.config.plugins || !hydra.config.plugins.loggly) {
      console.error('Missing loggly section in app config. See docs at: https://github.com/cjus/hydra-plugin-loggly')
      return;
    }

    let from = `${hydra.getServiceName()}:/`;
    let fromName = from.replace(':/','');
    let ts = new Date().getTime() / 1000 | 0;
    let settings = hydra.config.plugins.loggly;

    if (settings.logToConsole === true) {
      let text;
      if (typeof message === 'string') {
        text = message;
      } else {
        text = Utils.safeJSONStringify(message);
      }
      console.log(`${ts} ${type.toUpperCase()} ${fromName} | ${text}`);
    }

    if (!settings.onlyLogLocally) {
      serverRequest.send({
        method: settings.loggly.method,
        port: settings.loggly.port,
        hostname: settings.loggly.hostname,
        path: settings.loggly.path,
        headers: {
          'Content-Type': 'application/json'
        },
        body: Utils.safeJSONStringify({
          ts,
          serviceName: fromName,
          serviceVersion: hydra.getInstanceVersion(),
          instanceID: hydra.getInstanceID(),
          severity: type,
          body: message
        })
      });
    }
  }
};

