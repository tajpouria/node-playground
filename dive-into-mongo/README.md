## Running a mongo container

> docker pull mongo

> docker run -d -p 27017:27019-27017-27019 --name mongodb mongo

> docker exec -it mongodb bash # Ctrl+d to exit!

## Mongo Shell

https://docs.mongodb.com/manual/reference/mongo-shell/

- pretty()

  > db.collection.find().pretty()

- Override `_id` _it is possible as long as it is unique if not it will cause `WriteError`_

  > db.collection.addOne({\_id: 'unique-id'})

## A quick note about BSON

MongoDB represent JSON documents in binary-encoding format calling BSON; BSON extends JSON model to provide 1. Additional data Types 2. Ordered Fields 3. Efficiency for encoding and decoding data in different languages
This conversion happened by each languages MongoDB drivers. As an example of additional types consider `{ _id: ObjectId('') }`that is not available in JSON _JavaScript Object Notation_

## Manage mongo processes

https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/

- Running mongod on port

  > mongod --port 12345
  > mongo --port 12345 # Caveats mongo shell connecting to 27017 by default so consider that

- shut down mongod (There is couple of other ways e.g. shutdown from shell in provided link)
  > mongod --shutdown

## To Read

- [] How mongo actually works behind the scene
- [] **What How to design a efficient Collection schema**
