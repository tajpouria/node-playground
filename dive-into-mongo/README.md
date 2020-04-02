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

  - `--jsonArray` If JSON document wrapped into array

* limit() # Limit the number of retrieved data

  > db.collection.find().limit(5)

* skip() # Skips the first n specified number

* \$elemMatch: Matches the documents that contain an array field that at least one element matches specified query all criteria

  > db.collection.find({"score": {$elemMatch: {$gte: 80, \$lte: 85}}})

* dropDatabase

  > db.dropDatebase()

* \$exists: Identify whether a field exists or not

  > db.collection.find({ foo : {\$exists: true} })

* new Timestamp(): the result will be current time `Timestamp(1213123, 1)` the second argument of result _1 in this case_ is ordinal component which represents where to insert queue element

* db.stats()

* NumberInt(): Construct 32-bit number _Shell/javascript default Number type is 64-bit in_

> db.collection.insertOne({number: 1}) # 64-bit number
> db.collection.insertOne({number: NumberInt(1)}) # 32-bit number

- typeof

> typeof db.collection.findOne({\_id:1 }).number # Number

- \$lookup: Merging references https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#examples

  > db.books.aggregate([{$lookup: { from: 'authors', localField: 'authors', foreignField: '\_id', as: 'creators' }}])

- cursor.sort(): https://docs.mongodb.com/manual/reference/method/cursor.sort/

  > db.find().sort({name: -1}) # descending name order

- \$regex and \$not: https://docs.mongodb.com/manual/reference/operator/query/regex/#regex-and-not

  > db.collection.find({name: {$not: /^go/}})
  > db.collection.find({name: {$regex: /go\$/}})

- \$or https://docs.mongodb.com/manual/reference/operator/query/or/#or-clauses-and-indexes

  > db.collection.find({\$or: [{name: 'foo'}, {name: 'bar'}])

  btw \$or operator syntax are exactly same

- `db.collection.insert()` Not retrieves objectId() but `insertOne()` and `insertMany()` will

- Access array elements https://www.w3resource.com/mongodb-exercises/mongodb-exercise-23.php

  > db.collection.find({'grades.2.score': 15})

- \$where: https://stackoverflow.com/questions/4442453/mongodb-query-condition-on-comparing-2-fields

  > db.collection.find({\$where: function() { return Math.round(this.id) === 12}})

- \$type: https://docs.mongodb.com/manual/reference/operator/query/type/#querying-by-multiple-data-type

  > db.collection.find({coord" {\$type: 'double'}})

- \$mod: https://docs.mongodb.com/manual/reference/operator/query/mod/#op._S_mod

  > db.collection.find({score: {\$mod: [7,0]}})

## Operators

- Comparison Query Operators https://docs.mongodb.com/manual/reference/operator/query-comparison/

- Update Operators https://docs.mongodb.com/manual/reference/operator/update/
  - \$set
    > db.collection.update({ age: { $lte: 12 } }, {$set:{ mark: 'shouldDeleted' }})

## Insert

- ordered and unordered insert (consider by default {ordered: true}): https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#unordered-inserts

  > db.collection.insertMany([{ \_id: 12}, { \_id: 12}, {\_id: 13}], {ordered: true}) // Insert first by throw error on index 1 and not inserts rest
  > db.collection.insertMany([{ \_id: 12}, { \_id: 12}, {\_id: 13}], {ordered: false}) // Throw error on index 0 and 1 and not enter any one

- write Concern and journal

  > db.collection.insertOne({}, {writeConcern: {w: 1, j: undefined, wtimeout: 0 }}) // Default values; w: 1 means sever should acknowledged this - j: undefined means not to add write request to journal - wtimeout limit timeout until request completed consider wtimeout:0 means do not apply wtimeout

  e.g.

  > db.collection.insertOne({}, {writeConcern: {w: 0}}) // Don't wait until server acknowledged this

  > db.collection.insertOne({}, {writeConcern: {wtimeout: true}}) // Add the request to journal and wait until it Added

  > db.collection.insertOne({}, {writeConcern: {wtimeout: 200}}) // Time limit until to acknowledge result

## Manage mongo processes https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/

- Running mongod on port

  > mongod --port 12345
  > mongo --port 12345 # Caveats mongo shell connecting to 27017 by default so consider that

- shut down mongod (There is couple of other ways e.g. shutdown from shell in provided link)

  > mongod --shutdown

- Specify data directory

  > mongod --dbpath /srv/mongodb/

- Manage logs

  > mongod --logpath /var/log/mongodb/mongod.log

- Enable deamon mode which running mongos and mongod at the background

  > mongod --fork --logpath /var/mlogs.log

  - In order to shutdown mongod running on the background
    > mongo
    > use admin
    > db.shutdownServer()

- Configuration file https://docs.mongodb.com/manual/reference/configuration-options/index.html

  > mongod -f ./mongod.conf

## Data types https://data-flair.training/blogs/mongodb-data-types/

## To Read

- [] How mongo actually works behind the scene
- [] **How to design a efficient Collection schema** (Database architecture in general)
- [] MongoDB nesting limitation sees like 100 level of embedded and overall document size should be under 16mb
- [X] https://www.w3resource.com/mongodb-exercises/#PracticeOnline
- [] Validation actions in details
- [] db.command()
- [] write Concern and journal

## Sundry

- copy files/folders between a container and the local filesystem

  > docker cp ./mock.json mongodb:/user/mock # copy mock.json from local to mongodb container under /user/mock directory it is possible to copy from container to local

- [ERD](https://www.lucidchart.com/pages/ER-diagram-symbols-and-meaning)
