#!/bin/bash

# extended pattern matching
shopt -s extglob

env=$1 # dev, prod or an api url

url=""
case $env in
"dev") url="https://dev.samy-app.be" ;;
"prod") url="https://www.samy-app.be" ;;
"schaerbeek") url="https://schaerbeek.samy-app.be" ;;
http?(s)://*:*) url=$env ;;
*)
  echo "You must enter as first parameter : [dev, prod, schaerbeek] or an api url with port included !"
  exit 1
  ;;
esac

echo "Building app with api url : $env"

export REACT_APP_HOST_PORT_COMPLETE=$url
cd react-ui && npm run build
cd ..

echo "Zipping files to be uploaded on AWS BeansTalk"

if [[ "$env" == "dev" || "$env" == "prod" ]]
then
  zip -r "aws_$env.zip" . -x "aws_dev.zip" "aws_prod.zip" "react-ui/node_modules/*" "react-ui/src/*" "venv/*" ".idea/*" ".git/*" db.sqlite3 "api/__pycache__/*" "ssh_bitbucket/*" "static/*"
fi

exit 0
