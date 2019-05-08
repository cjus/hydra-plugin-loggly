let http = require('http');
const REQUEST_TIMEOUT = 30000; // 30-seconds

/**
 * @name ServerRequest
 * @summary Class for handling server requests
 */
class ServerRequest {
  /**
  * @name constructor
  * @summary Class constructor
  * @return {undefined}
  */
  constructor() {
  }

  /**
   * @name setProtocol
   * @description set http or https
   * @return {undefined}
   */
  setProtocol(https) {
    http = (https) ? require('https') : require('http');
  }

  /**
  * @name send
  * @summary sends an HTTP Request
  * @param {object} options - request options
  * @return {object} promise
  */
  send(options) {
    return new Promise((resolve, reject) => {
      if (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH') {
        options.headers = options.headers || {};
        options.headers['Content-Length'] = options.body.length;
      } else {
        delete options.body;
      }

      let req = http.request(options, (res) => {
        let response = [];
        res.on('data', (data) => {
          response.push(data);
        });
        res.on('end', () => {
          let buffer = Buffer.concat(response);
          let data = {
            statusCode: res.statusCode,
            headers: res.headers
          };
          data.headers['Content-Length'] = Buffer.byteLength(buffer);
          data.payLoad = buffer;
          resolve(data);
        });
        res.on('error', (err) => {
          reject(err);
        });
      });

      req.on('socket', (socket) => {
        socket.setNoDelay(true);
        socket.setTimeout(options.timeout * 1000 || REQUEST_TIMEOUT, () => {
          req.abort();
        });
        socket.on('error', (error) => {
          req.abort();
        });
      });

      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }
}

module.exports = ServerRequest;
