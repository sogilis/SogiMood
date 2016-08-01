# sogimood-backend

Simple backend written in [Go](https://golang.org/). It uses the [gorm](https://github.com/jinzhu/gorm) library to persist data into Postgres. To see all available routes, simply start the backend and visit `http://localhost:8081`.

## Basic usage

```
go get -u ./...                 # should install all dependencies
go build && ./sogimood-backend
```

## How do I know the API models?

Please refer to `api.go`.

## I don't want to install a Posgres instance to start your app, damn it!

That's why there is a `docker-compose` file, in the `docker` folder. The app is configured to start in dev mode automatically.
