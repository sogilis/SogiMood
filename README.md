# SogiMood

SogiMood is a projects' mood manager. It helps you to monitor your projects's
health by showing the evolution of three variables: customer's mood, team's
mood and the financial health.

It has been developed for and by [Sogilis](http://sogilis.com).

## Installing

SogiMood comes in two parts: backend is a ligh Go application, frontend is
developed with React.

### Backend

First, you must [install Go](https://golang.org/doc/install).

Then, install the dependencies and build the application:

```bash
$ go get -u ./...
$ go build
```

It should create the server binary: `./sogimood`.

Before running it, you must install a Redis base. For Fedora:

```bash
$ sudo dnf install redis
$ sudo systemctl start redis
```

These commands must be adapted depending on your current Gnu/Linux
distribution.

There are three environment variables you can set:

```bash
REDIS_URL="redis://:@127.0.0.1:6379"
PORT=8081
ACCESS_TOKEN=""
```

`ACCESS_TOKEN` is used to protect the API access.

### Frontend

The frontend has been created through [`create-react-app`](https://github.com/facebookincubator/create-react-app).

You need to have NPM installed on your computer. For Fedora:

```bash
$ sudo dnf install npm
```

Or you may find useful to use [NVM](https://github.com/creationix/nvm) which is
able to manage several versions of NodeJS/NPM at a time.

Next, you need to download all the crapy-JS-dependencies:

```bash
$ cd client
$ npm install
```

## Developing

Depending if you develop the back or the front, the workflow will be slightly
different. We provide some scripts to help. Under the hood, they are mainly
reusing `go build` and `create-react-app`'s commands (`npm start` and `npm run
build`).

### `scripts/package.sh`

It compiles both frontend and backend and moves front files under `./dist` so
the backend is able to serve them. If you want to develop for the backend only,
you may find useful to run this command first. Then you can simply rebuild the
binary with `go build` and run the binary with `./sogimood`.

### `scripts/run.sh`

It's a shortcut to get the backend's dependencies, build the binary and run it.
It doesn't touch to the frontend.

### `scripts/dev-front.sh`

It is useful when you want to develop for the frontend. It executes the
previous script in background to have the backend running on localhost:8081 and
start a small NodeJS server able to do hot reloading. It means the frontend
will open on localhost:3000 and each time you change a JS file, it will
automatically reload the page.

All the JSON requests are automagically proxified to the backend so you don't
have to worry about CORS issues.

When accessing localhost:3000 at the first time, an error could happen if the
backend is not running yet. Just wait for it and reload the page.

### Few answers to questions you don't ask yet

**What are the available API routes?**

```
GET /api/projects

DELETE /api/project?id={uuid}

# Either specify an ID if you want to update, or leave it blank if you want the
# server to create a new entry.
POST /api/project
Body: [project to insert]

# id refers to the project id, of course.
POST /api/mood?id={uuid}&weekNo={weekNo}
Body: [mood to upsert]
```

**Why the frontend is not able to access the API?**

Did you set the `Access-Token` and `Content-Type` headers?

```
Access-Token: <token>
Content-Type: application/json
```

**How do I know the API models?**

Please refer to `./api.go`.

## Deploying

Sogimood is actually deployed on Heroku.

First, you should have a running Heroku app, configured with a Redis database
and the `ACCESS_TOKEN` should be set (unless you want your Sogimood in free
access!)

Add your Heroku app's Git repository as a remote of your local repo:

```bash
$ git remote add heroku https://git.heroku.com/sogimood.git
```

Now we're done, there's a last script we didn't explain in the previous
section: `scripts/deploy.sh`.

This script builds the frontend, commits the generated `./dist` folder, push
force the code on Heroku and reverts the last commit. Yeah, it's a bit dirty
but I have no better solution in mind yet. Feel free to contribute! :)

## Updating Go dependencies

Dependencies are handled by Godep. First, install it:

```bash
$ go get github.com/tools/godep
```

Then, simply run from the root of the project:

```bash
$ godep save
```

To finish, do not forget to commit these new dependencies.

## What about the tests?

SogiMood has been developed following the "quick and very dirty method". Even
if the code is going better these last days, we don't have any test yet. There
is [a ticket about this](https://framagit.org/sogilis/sogimood/issues/11).
