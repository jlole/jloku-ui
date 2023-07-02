# Jloku

5x5 puzzle

## Available Scripts

In the project directory, you can run:

### `npm install`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


# Deploying
Push to main branch \
If the runner has stopped then cd into the runner directory on the server and run
`./svc.sh start`

# Local Setup

## Build jloku-api
`cd jloku-api` \
`docker build -t jloku-api .`

## Hosts file
Add `jloku.local` to `/etc/hosts`

## Docker compose
`cd jloku-api` \
`cd local` \
`docker-compose up -d` \
`docker exec local-jloku-api-1 python update_daily.py`
