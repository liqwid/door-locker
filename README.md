# Image upload application

Based on create-react-app --scripts-version=react-scripts-ts

UI explained in Help.jpg

## Local setup

### Install node/packages

1. Install node https://nodejs.org/en/, node 8 is required
2. Install yarn globally `npm i -g yarn`
3. Install packages `yarn`

### Install DB

1. Install PostgreSQL https://www.postgresql.org/download/
2. Setup a project DB and user with access to ta target DB

### Install heroku

1. Download and install heroku CLI `https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up`
2. Login to heroku account with and access to the loheroku app, name is `door-locker`

### Enviromental variables

1. Add a `.env` file in project root
2. Add line `DATABASE_URL = postgres://user_name@password@0.0.0.0:5432/db_name`, where `user_name`, `password` and `db_name` are one used during db installation
3. Add Line `REACT_APP_URL='http://localhost:3000/'`
3. Add auth0 env variables `heroku config -s -a door-locker | grep 'AUTH0_CLIENT_ID\|AUTH0_CLIENT_SECRET\|AUTH0_DOMAIN\|REACT_APP_AUTH0_CLIENT_ID\|REACT_APP_AUTH0_CLIENT_SECRET\|REACT_APP_AUTH0_DOMAIN\|REACT_APP_AUDIENCE' | tee -a .env`

### Launch

1. Run app `yarn local:start`
2. Open browser at `localhost:3000`

## Tests

1. Run `yarn test`
