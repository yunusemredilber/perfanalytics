# Perfanalytics

Perfanalytics is an ecosystem which collects and criticizes web performance data.
It consists three subsystems:

* JS Library
* API
* Dashboard

Also, there is a simple one page react app to test the js library.

## Development

1. Set up environment variables by creating a .env file in the root.
1. Install npm packages for all apps `yarn install:all`
1. Start the api `yarn start`
1. Start the dashboard `yarn start:dashboard`
1. Start the test app `yarn start:testapp`

* To see the dashboard go to [http://localhost:3001](http://localhost:3001)
* To see the test app go to [http://localhost:3002](http://localhost:3002)

## Production

1. Setup a ready to use server with node or use docker `docker-compose up`
1. Set up environment variables.
1. Install npm packages for the api `yarn install`
1. Build react apps `yarn build`
1. Start the api `yarn start`

* To see the dashboard go to [https://yourserver.com/dashboard](https://yourserver.com/dashboard)
* To see the test app go to [https://yourserver.com/test](https://yourserver.com/test)

## Test

1. Set up environment variables. (OS Variables or .env)
1. Install npm packages for all apps `yarn install:all`
1. Build react apps `yarn build` (not required)
1. Start testing `yarn test`

## Environment variables

You need to set the env variables below to make the apps work nicely with each other.

* DB_URI = A convenient mongodb connection URI
* REACT_APP_CLIENT_SCRIPT_PATH = Should point to perfanalytics js library.
  * Development: http://localhost:3000/perfanalytics.js
  * Production example: https://yourserver.com/perfanalytics.js
* REACT_APP_SERVICE_URL = 
  * Development: http://localhost:3000
  * Production example: https://yourserver.com
