SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

$SCRIPT_DIR/package.sh

sed s/dist// .gitignore -i
git add .
git commit -m "Deployment"

git push -f heroku HEAD:master

git reset --hard HEAD^
