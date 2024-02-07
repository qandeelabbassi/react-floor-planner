# Planner  `v0.1`
Floor Planner for designing HVAC layout

## Screenshots
|                      2D                      |                        3D                        |
|:-------------------------------------------------:|:--------------------------------------------------:|
| <img src="https://github.com/qandeelabbassi/react-floor-planner/assets/14296772/e90b2269-8838-4b4d-b175-8c406afee133" > | <img src="https://github.com/qandeelabbassi/react-floor-planner/assets/14296772/69cf08c8-5187-4b77-97ee-0e3e353ef14a" > |

## Built With
* [Nodejs](https://nodejs.org/) - For backend
* [Reactjs](https://reactjs.org/) - For frontend
* [Yarn](https://yarnpkg.com/) - For package management
* [Threejs](https://threejs.org/) - The 3D engine

Tested using following versions: 

<img alt="NodeVersion" src="https://img.shields.io/badge/Node-v16.13.0-green"/>
<img alt="ReactVersion" src="https://img.shields.io/badge/React-v16.0.0-61dafb.svg"/>
<img alt="YarnVersion" src="https://img.shields.io/badge/Yarn-v1.22.17-blue"/>
<img alt="ThreeVersion" src="https://img.shields.io/badge/Threejs-v0.94.0-blue"/>

## Directory Structure

```
.
|-- bin (contains executable node startup scripts)
|   `-- www (starts express server)
|-- client (frontend resources)
|   |-- public (contains static files such as index.html, images, assets, etc.)
|   |-- src (frontend source code)
|   |-- README.md
|   |-- craco.config.js (to override default create-react-app configs)
|   `-- package.json
|-- routes (contains express server routes to serve files and APIs)
|   `-- main.js
|-- LICENSE
|-- README.md
|-- app.js (contains all the express middleware i.e. body-parser, morgan, etc and routes)
`-- package.json
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- [Nodejs](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)  `npm install -g yarn`

### Installing
1. Clone repository from github: `https://gitlab.com/amplify2/planner.git`
2. Run `yarn install` in root folder.

### Running in Development Environment:
Follow these steps to run in development environment:

1. Run `yarn dev` in root folder (takes some time to finish)
2. Open the app on http://localhost:3000

The website will run on localhost port 3000 and the server will be listening on port 4040.

### Deploying in Production Environment:

Follow these steps to build and run the app for production:

1. In `.env` comment development variable and uncomment production variables.
2. Run `yarn build` in root folder. This bundles the client code in production mode and copies it to `/public` folder 
3. Then run `yarn start` in root folder -OR- To use pm2 use this command `pm2 start ./bin/www --name planner`. This will start the express server on the port defined in .env file. There's only one defined route in express server at the moment and that is `/` which serves the main page of the planner.
4. Open the app on http://localhost:4040 to see if everything is working
5. In your webserver configuration forward the requests received on its public url (e.g. https://planner.com) to `localhost:4040`.

## Environment Variables
1.  **For server:**
    - NODE_ENV= either development or production
    - PORT= express server port

