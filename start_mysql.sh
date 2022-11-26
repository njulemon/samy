#!/bin/sh
# $1 = login, $2 = password, $3 = password_root
echo Stop MYSQL
docker stop mysql_samy
echo Wait
docker wait mysql_samy
echo Remove
docker rm mysql_samy
docker wait mysql_samy
echo Start MYSQL
docker run -p 127.0.0.1:3307:3306  --name mysql_samy -e MYSQL_ROOT_PASSWORD=$3 -d mysql
echo Run command
sleep 10
mysql -v -h "127.0.0.1" -P "3307" -u "root" "-p$3" << QUERY
CREATE USER $1 IDENTIFIED BY '$2';
CREATE DATABASE samy CHARACTER SET UTF8;
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON deactivation.* to $1;
QUERY