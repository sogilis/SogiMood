SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/.."
FRONTEND_DIR="$BACKEND_DIR/client"

rm -rf $BACKEND_DIR/dist

cd $FRONTEND_DIR
npm install
npm run build
mv build $BACKEND_DIR/dist

cd $BACKEND_DIR
go get -u ./...
go build
