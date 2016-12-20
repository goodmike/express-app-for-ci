# express-app-for-ci

Driver app for running integrations with CicleCI and heroku.

## Step 1: Rough out an express app.

I followed an in-depth [blog post](http://mherman.org/blog/2016/09/12/testing-node-and-express/#.WFbM9ZIjZA9) 
to implement part of a CRUD API with integration and unit tests.

* Generate app with galvanaize-express yeoman generator.
* Setup dev and test databases in postgresql.
* Use [knex query builder](http://knexjs.org/) for DB interaction.
 
### Notes:
 
Since the goal of this toy app is to run in `production` mode at 
heroku, be sure to npm install `knex` and `pg` as project dependencies, 
not just dev-dependencies:
 
 ```
 npm install knex@0.11.10 pg@6.1.0 --save
```

 I chose to hard-code the connection information for the dev and test
 databases and to rely on the DATABASE_URL env param in production mode.
 This allowed me to avoid using a local `.env` file for dev and testing.
 I therefore deleted this line from `server/config/main-config.js`
 ```
 require('dotenv').config();
 ```
Trying to require the contents of an `.env` file on heroku, where it 
doesn't exist, only causes problems later on.
 
## Step 2: Deploy to CircleCI

Integrate github with CircleCI so that pushing to github triggers a 
build on CircleCI.

* Follow the service integration instructions on CircleCI's website.
* Create and commit a `circle,yml` file in the root of the project 
directory. In the file, specify the creation of the postgresql database:
```
database:
  override:
    - createdb -O ubuntu express_tdd_testing
```
* Push to github, confirm project builds on CircleCI.

## Step 3: heroku

Make the app work when pushed to heroku.

* Set up a heroku project with a basic postgres database.
* Create and commit a Procfile so heroku knows how to start the app:
```
web: node ./src/server/server
```
* Add a configuration object for a `production` environment to 
`knexfile.js`:
```
 production: {
     client: 'postgresql',
     connection: process.env.DATABASE_URL + '?ssl=true',
     migrations: {
       directory: __dirname + '/src/server/db/migrations'
     },
     seeds: {
       directory: __dirname + '/src/server/db/seeds'
     }
   }
```
* Push to heroku to demonstrate the app can be deployed.
* Confirm the knex database migration and seed commands can be run on
 heroku:
```
heroku run knex migrate:latest
heroku run knex seed:run
```

### Notes:

Once upon a time knex had trouble working on heroku because it wouldn't
make database connections over SSL. That's resolved, so all we have to 
do is add ` + '?ssl=true'` to the proction `connection` value in 
`knexfile.js`.

## Step 4: Set up CircleCI to deploy successful build to heroku
 
Show me the continuous delivery!

* Follow instructions at CircleCI to integrate with a heroku account.
* Add instructions for deploying to heroku to the `circle.yml` file:
```
deployment:
  staging:
    branch: master
    heroku:
      appname: your-heroku-app-name
```

Confirm everything works by pushing to github. The app should build in
CircleCI and then deploy to heroku, where it should be up and running.
