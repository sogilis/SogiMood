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

POST /mood?id={uuid}&weekNo={weekNo} Headers: {"Content-Type": "application/json"} Body: mood to upsert

```

## How do I know the API models?

Please refer to `api.go`.

## TODO

- Take a look at the [Gin framework](https://gin-gonic.github.io/gin/).
