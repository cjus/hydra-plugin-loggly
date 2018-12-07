# hydra-plugin-loggly
Hydra logging plugin for use with loggly.com

Install using npm:  npm install hydra-plugin-loggly --save


Can be used with other remote http logging services or serve as the basis of a new logging plugin.

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
          "path": "/inputs/{loggly-token}/tag/http/",
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
