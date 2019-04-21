#!/bin/sh

echo "Starting MagiQL server"
yarn magiql:start --port=$GQL_PORT --dbHost=$MAGISHIFT_DB_HOST --dbPassword=$MAGISHIFT_DB_PASSWORD --dbUser=$MAGISHIFT_DB_USER --dbSchema=$MAGISHIFT_DB_NAME --dbPort=$MAGISHIFT_DB_PORT
