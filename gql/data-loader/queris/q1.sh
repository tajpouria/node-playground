#! /bin/bash

curl \
-X POST \
-H "Content-Type: application/json" \
--data '{ "query": "{ books } " }' \
http://127.0.0.1:4000/graphql

