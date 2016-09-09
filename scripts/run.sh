SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/.."

cd $BACKEND_DIR
go get -u ./...
go build && ./sogimood
