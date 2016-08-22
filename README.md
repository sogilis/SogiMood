# sogimood-backend

Simple backend written in [Go](https://golang.org/). It uses the [redigo](https://godoc.org/github.com/garyburd/redigo/redis) library to persist data into a Redis instance. Visit `http://localhost:8081`.

## Basic usage

```
go get -u ./...
go build && ./sogimood-backend
```

## What routes can I use at the moment?

```
GET /projects

DELETE /project?id={uuid}

POST /project Headers: {"Content-Type": "application/json"} Body: project to insert
# Either specify an ID if you want to update, or leave it blank if you want the server to create a new entry.

POST /mood?id={uuid}&weekNo={weekNo} Headers: {"Content-Type": "application/json"} Body: mood to upsert
```

## Specific HTTP request headers to set

```
Access-Token: <token> # used by the server to authenticate request, returns 401 on validation failure.
Content-Type: application/json
```

## How do I know the API models?

Please refer to `api.go`.

## How to deploy on heroku

If you updated the deps, you must use `godep` to update `Godeps` and `vendor` dependency folders. Install `godep` and run `godep save` from the root of this project, then commit new vendored dependencies.

## TODO

- Take a look at the [Gin framework](https://gin-gonic.github.io/gin/).
