SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/../client"

$SCRIPT_DIR/run.sh &

cd $FRONTEND_DIR
npm start
