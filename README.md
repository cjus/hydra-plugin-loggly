# hydra-plugin-loggly
Hydra logging plugin for use with loggly.com

Install using npm:  `npm install hydra-plugin-loggly --save`

Can be used with other remote http logging services or serve as the basis of a new logging plugin.

Your service config:

```
  "hydra": {
    "serviceName": "yourservicename",
    "serviceDescription": "service description",
    "serviceIP": "",
    "servicePort": 82,
    "serviceType": "",
    "plugins": {
      "hydraLogger": {
        "remoteLogger": {
          "method": "POST",
          "protocol": "http",
          "hostname": "logs-01.loggly.com",
          "port": 80,
          "path": "/inputs/{loggly-token}/tag/http/"
        },
        "logToConsole": true,
        "onlyLogLocally": false
      }
    },
    "redis": {
      "url": "redis://host:6379/15"
    }
  }
```

Supports HTTP / HTTPS in the remoteLogger section.

In your main JS file:

```
const hydra = require('hydra');
const HydraLogger = require('hydra-plugin-loggly/hydra');
let hydraLogger = new HydraLogger();
hydra.use(hydraLogger);
```

Note if using hydra-express then use:

```
const hydraExpress = require('hydra-express');
const HydraLogger = require('hydra-plugin-loggly/hydra-express');
let hydraLogger = new HydraLogger();
hydraExpress.use(hydraLogger);
```

Then simply log in our application using:

```
hydra.log('info', anObject);
hydra.log('info', aString);
```

or with HydraExpress:

```
hydraExpress.log('info', anObject);
hydraExpress.log('info', aString);
```

* 'info' can be: 'info', 'debug', 'error', 'fatal' or a custom string you define.

You message will be logged with your service name, version, instanceID and message body.

```
{
  "ts":1544222050,
  "serviceName":"user-session-service",
  "serviceVersion":"0.2.2",
  "instanceID":"8098dcd5d51140108ea32fc28f46deb0",
  "severity":"info",
  "body":{
    "msg":"Starting service user-session-service:0.2.2 on 10.0.9.52:10700"
  }
}
```
