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
    if (!type || type === '') {
      type = 'fatal';
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
      let entry = Utils.safeJSONStringify({
        ts,
        serviceName: fromName,
        serviceVersion: hydra.getInstanceVersion(),
        instanceID: hydra.getInstanceID(),
        severity: type,
        body: message
      });
      serverRequest.send({
        method: settings.method,
        port: settings.port,
        hostname: settings.hostname,
        path: settings.path,
        headers: {
          'content-type': 'text/plain'
        },
        body: entry
      })
        .catch((err) => {
          console.log(`Error logging this [${entry}] to loggly due to this err`, err);
        });
    }
  }
};

