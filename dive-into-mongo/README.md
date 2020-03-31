## Running a container

> docker pull mongo

> docker run -d -p 27017:27019-27017-27019 --name mongodb mongo

> docker exec -it mongodb bash # Ctrl+d to exit!

## A quick note about BSON

MongoDB represent JSON documents in binary-encoding format calling BSON; BSON extends JSON model to provide 1. Additional data Types 2. Ordered Fields 3. Efficiency for encoding and decoding data in different languages
This conversion happened by each languages MongoDB drivers. As an example of additional types consider `{ _id: ObjectId('') }`that is not available in JSON _JavaScript Object Notation_
`{ "_id" : ObjectId("5e830160ff2c1aa15e65b897"), "name" : "foo" }`

## Shell https://docs.mongodb.com/manual/reference/mongo-shell/

- `db.collection.find()` returns cursor object, checkout utility function by chaining `help()` method to it _consider `db.collection.findOne()` retrieves the actual docuement_

  > db.collection.find().help()

  > db.collection.find().forEach(doc => printjson(doc))

- pretty()

  > db.collection.find().pretty()

- Override `_id` _it is possible as long as it is unique if not it will cause `WriteError`_

  > db.collection.addOne({\_id: 'unique-id'})

- Projection: Include or exclude data on mongo server

  > db.collection.find({}, {name: 1, \_id: 0}) # include name and exclude \_id

- Access embedded docs:
  consider following JSON as document:

  ```json
  {
    "details": {
      "tags": ["sport"],
      "foo": {}
    }
  }
  ```

  > db.collection.find({"details.tags": "sport"}) # array contains "sport"!
  > db.collection.find({}, {"details.tags": 1}) # projection

- Load js script https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/

- update vs updateMany: `update` find all elements matching filter and _replace_ them with provided data; however `updateMany` and `updateOne` throw error if no atomic operator provided; In general using `db.collection.replaceOne()` is recommended

- mongoimport https://docs.mongodb.com/guides/server/import/

  > mongoimport --db test --collection restaurants --drop --file ./usr/mock/mock.json

- limit() # Limit the number of retrieved data

  > db.collection.find().limit(5)

- skip() # Skips the first n specified number

- \$elemMatch: Matches the documents that contain an array field that at least one element matches specified query all criteria

  > db.collection.find({"score": {$elemMatch: {$gte: 80, \$lte: 85}}})

## Operators

- Comparison Query Operators https://docs.mongodb.com/manual/reference/operator/query-comparison/

- Update Operators https://docs.mongodb.com/manual/reference/operator/update/
  - \$set
    > db.collection.update({ age: { $lte: 12 } }, {$set:{ mark: 'shouldDeleted' }})

## Manage mongo processes https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/

- Running mongod on port

  > mongod --port 12345
  > mongo --port 12345 # Caveats mongo shell connecting to 27017 by default so consider that

- shut down mongod (There is couple of other ways e.g. shutdown from shell in provided link)
  > mongod --shutdown

## To Read

- [] How mongo actually works behind the scene
- [] **How to design a efficient Collection schema**
- [] MongoDB nesting limitation sees like 100 level of embedded and overall document size should be under 16mb
- [] https://www.w3resource.com/mongodb-exercises/#PracticeOnline

## Sundry

- copy files/folders between a container and the local filesystem

  > docker cp ./mock.json mongodb:/user/mock # copy mock.json from local to mongodb container under /user/mock directory it is possible to copy from container to local
