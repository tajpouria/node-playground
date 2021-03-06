# Running a container

> docker pull mongo

> docker run -d -p 27017:27019-27017-27019 --name mongodb mongo

> docker exec -it mongodb bash # Ctrl+d to exit!

## A quick note about BSON

MongoDB represent JSON documents in binary-encoding format calling BSON; BSON extends JSON model to provide 1. Additional data Types 2. Ordered Fields 3. Efficiency for encoding and decoding data in different languages
This conversion happened by each languages MongoDB drivers. As an example of additional types consider `{ _id: ObjectId('') }`that is not available in JSON _JavaScript Object Notation_
`{ "_id" : ObjectId("5e830160ff2c1aa15e65b897"), "name" : "foo" }`

## Shell https://docs.mongodb.com/manual/reference/mongo-shell/

- running JS file into shell
  > \$ mongo file-name.js

* `db.collection.find()` returns cursor object, checkout utility function by chaining `help()` method to it _consider `db.collection.findOne()` retrieves the actual docuement_

  > db.collection.find().help()

  > db.collection.find().forEach(doc => printjson(doc))

* pretty()

  > db.collection.find().pretty()

* count()

  > db.collection.find({$nor: [{'score.average': { $gt: 30}}, {'sore.average': { $lte: 12 }}]}) // $nor acts inverse of \$or

* Override `_id` _it is possible as long as it is unique if not it will cause `WriteError`_

  > db.collection.addOne({\_id: 'unique-id'})

* Projection: Include or exclude data on mongo server

  > db.collection.find({}, {name: 1, \_id: 0}) # include name and exclude \_id

* Access embedded docs:
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

* Projection:

  > db.collection.find({}, {"details.tags": 1, age: 1, \_id: 0)}) # Projection

  ---

  > db.collection.find({'scores': {$gt: 20}}, {'tags.\$': 1}) # Array projection in this case only return the first element that is greater than 20 https://docs.mongodb.com/manual/reference/operator/projection/positional/#examples

---

> db.collection.find({'genres': 'Drama'}, {genres: {$elemMach: {\$eq: 'Horror'}}}) # Array projection https://docs.mongodb.com/manual/reference/operator/projection/elemMatch/#zipcode-search

---

> db.collection.find({'genres': 'Drama'}, {genres: {\$slice: [1, 2]}}) # [1, 2] means skip 1 element and return next 2 element

- Load js script https://docs.mongodb.com/manual/tutorial/write-scripts-for-the-mongo-shell/

- update vs updateMany: `update` find all elements matching filter and _replace_ them with provided data; however `updateMany` and `updateOne` throw error if no atomic operator provided; In general using `db.collection.replaceOne()` is recommended

- mongoimport https://docs.mongodb.com/guides/server/import/

  > mongoimport --db test --collection restaurants --drop --file ./usr/mock/mock.json

  - `--jsonArray` If JSON document wrapped into array

* limit() # Limit the number of retrieved data

  > db.collection.find().limit(5)

* skip(): Skips the first n specified number

- Searching nested arrays: Also consider following for searching array fields:

> db.collection.addMany([{score: {title: 'A'}}, {score: {title: 'B'}}])
> db.collection.find({'score.title': 'A'})

- \$elemMatch: Matches the documents that contain an array field that at least one element matches specified query all criteria

  > db.collection.find({"score": {$elemMatch: {$gte: 80, \$lte: 85}}})

  Let me get **\$elemMatch** actual use case straight; Consider following example:

  > let data = [{hobbies: [{title: 'foo', freq: 2}, {title: 'bar', freq: 4}] }]
  > db.collection.insertMany(data)

  Consider we're lookup for document contains elements title=2 and freq=4:

  > db.collection.find({'hobbies.title': 'foo', 'hobbies.freq': 4 }})

> here's the result we get:

```js
{
  hobbies: [
    { title: "foo", freq: 2 },
    { title: "bar", freq: 4 }
  ];
}
```

But there is a problem here; We're actually looking for a document that contains exactly `{ title: 'foo', freq: 4}`; using `\$elemMatch` is the solution:

> db.collection.find({hobbies: {\$elemMatch: {title: 'foo', freq: 4}}})

- \$size: Query array size

  > db.collection.find({hobbies: {\$size: 3}})

- \$all: All elements included in array field but the order doesn't matter

  > db.collection.find({hobbies: {genres: {\$all: ['Drama', 'Horror']}}})

- dropDatabase

  > db.dropDatebase()

- \$exists: Identify whether a field exists or not

  > db.collection.find({ foo : {\$exists: true} })

- new Timestamp(): the result will be current time `Timestamp(1213123, 1)` the second argument of result _1 in this case_ is ordinal component which represents where to insert queue element

- db.stats()

- NumberInt(): Construct 32-bit number _Shell/javascript default Number type is 64-bit in_

> db.collection.insertOne({number: 1}) # 64-bit number
> db.collection.insertOne({number: NumberInt(1)}) # 32-bit number

- typeof

> typeof db.collection.findOne({\_id:1 }).number # Number

- \$lookup: Merging references https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#examples

  > db.books.aggregate([{$lookup: { from: 'authors', localField: 'authors', foreignField: '\_id', as: 'creators' }}])

- cursor.sort(): https://docs.mongodb.com/manual/reference/method/cursor.sort/

  > db.find().sort({'details.name': -1}) # descending name order

- \$regex and \$not: https://docs.mongodb.com/manual/reference/operator/query/regex/#regex-and-not

  > db.collection.find({name: {$not: /^go/}})
  > db.collection.find({name: {$regex: /go\$/}})

- \$or https://docs.mongodb.com/manual/reference/operator/query/or/#or-clauses-and-indexes

  > db.collection.find({\$or: [{name: 'foo'}, {name: 'bar'}]})

  btw \$and operator syntax are exactly same

  **Note**: So why even \$and operator exists since we can use for example `db.collectino.find({foo: 'bar', bar: 'foo'})` ?
  There is gotcha there consider this example `db.collection.find({genres: 'Horror', genres: 'Drama'})` as you can see we're looking for documents that have either 'Horror' or 'Drama' in their genres:
  BUT in JSON document there is no duplicate key allowed _duplicate key overrided_:

```js
JSON.stringify({ foo: "bar", foo: "foo" }) === JSON.stringify({ foo: "foo" });
```

There the actual place that `$or` operator comes into the play `db.collection.find({$or: [{genres: 'Horror'}, {gneres: 'Drama'}]})`

- `db.collection.insert()` Not retrieves objectId() but `insertOne()` and `insertMany()` will

* Access array elements https://www.w3resource.com/mongodb-exercises/mongodb-exercise-23.php

  > db.collection.find({'grades.2.score': 15})

* \$where: https://stackoverflow.com/questions/4442453/mongodb-query-condition-on-comparing-2-fields

  > db.collection.find({\$where: function() { return Math.round(this.id) === 12}})

* \$expr: Compare to filed together: https://docs.mongodb.com/manual/reference/operator/query/expr/#op._S_expr

  > db.collection.find({$expr: {$gt:['$foo', '$bar']}) // Retrieve the documents which field foo is greater than bar

* \$type: https://docs.mongodb.com/manual/reference/operator/query/type/#querying-by-multiple-data-type

  > db.collection.find({coord" {\$type: 'double'}})

* \$mod: https://docs.mongodb.com/manual/reference/operator/query/mod/#op._S_mod

  > db.collection.find({score: {\$mod: [7,0]}})

* Find an array the contains element or is the certain element

  > db.collection.find({genres: "Drama"}) // Retrieve documents that it's genres field contain 'Drama' like ['Dream', 'Horror']
  > db.collection.find({genres: ["Drama"]}) // Retrieve documents that it's genres is exactly ['Drama']

* \$inc: Increment with a certain number

  > db.users.updateMany({}, {\$inc: {age: -1}})

* $min, $max: Increment or decrement the value if $min is less than or $max is greater than it:

  > db.users.updateOne({}, {\$min: {age: 32}}) // For example in this case age will be 32 if : 32 is less than current value

* \$unset: Remove a field

  > db.users.updateOne({name: 'foo'}, {\$unset: {age: ''}})

* \$rename:

  > db.users.updateMany({}, {\$rename: {name: 'firstName'}})

* \$upsert: blend of update and insert _Insert if not exists_

  > db.users.updateMany({name: 'yike'}, {\$set:{age: 20}})

* **\$(update) refer to matched document** for instance consider following example we're trying to add a field to first document that matches https://docs.mongodb.com/manual/reference/operator/update/positional/

  > db.users.updateMany({hobbies: {$elemMatch: {title: 'Cocking'}}}, {$set:{'hobbies.\$.thisFieldAddedByQuery': true }})

* \$[] : Update all element of embedded array https://docs.mongodb.com/manual/reference/operator/update/positional-all/#examples

  > db.collection.updateMany({'hobbies.title': 'Hiking'}, {$inc: {"hobbies.$[].freq": 1 }})

* arrayFilters Update documents that matches arrayFilters https://docs.mongodb.com/manual/reference/operator/update/positional-filtered/index.html#update-all-array-elements-that-match-arrayfilters

  > db.collection.updateOne({}, {$set: {'hobbies.$[el].mark': true}}, {arrayFilters: [{'el.shouldMarked' : true}]}) # el is an arbitrary name

* Adding element to an array : $push, $each:

  > db.collection.updateMany({}, {$push: {hobbies: {title: 'foo'}}}) # Push one document
  > db.collection.updateMany({}, {$push: {hobbies: {$each: [{title: 'foo'}, {title: 'bar}] $sort: {title: -1}}}}) # More than one; \$sort specify how elements should be sorted before pushing into array

* Remove element from array: $pull, $pop:

  > db.collection.updateMany({}, {\$pull: {hobbies: {title: 'foo'}}})
  > db.collection.updateMany({}, {\$pop: {hobbies: 1}})

- \$addToSet adds unique values only

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

## Index

Using indexes to retrieving a portion of document is efficient; But in order to reaching whole a vast majority of it; It just slow down the query excitation Because it's adding an extra step _Changing from IXSCAN to COLLSCAN_

- explain()

  > db.collection.explain('executionStats').find()
  > db.collection.explain('allPlanExecution').find()

- createIndex()

  > db.collection.createIndex({'dob.age': 1}) // Accending age order
  > db.collection.createIndex({gender:1, 'dob.age':1}) // Compound index consider the order is matter in compound index in this example docs will sorted first based on gender and then dob.age https://docs.mongodb.com/manual/core/index-compound/#sort-order

- dropIndex()

  > db.collection.dropIndex({'dob.age': 1})
  > db.collection.dropIndex('index name')

- getIndexes()

  > db.collection.getIndexes()

- createIndex options : https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/#options

  > db.collection.createIndex({email: 1}, {unique: true}) // The document will no longer except insert or update values that matches the existing index value

* partial Index https://docs.mongodb.com/manual/core/index-partial/#examples

  > db.collection.createIndex({ age: 1}, { partialFilterExpression: {gender: 'male'}})

* expireAfterSeconds

It only works on Date object and single index not compound indexes

> db.session.insertOne({createdAt: new Date()})
> db.session.createIndex({createdAt: 1}, {expireAfterSeconds: 10}) // Delete document 10 sec after createdAt
> db.session.insertOne({createdAt: new Date()})

- Covered query
  A covered query is a query that can be satisfied entirely using an index and does not have to examine any documents you can check covered query by it's `totalDocsExamined: 0` on `db.collection.explain('executionStats').your_query()` https://www.tutorialspoint.com/mongodb/mongodb\_covered\_queries.htm

* Create index on the background:
  Creating index in foreground _default behaviour_ cause mongo shell block other queries; But using background let query to resolve by server while indexes are creating
  > db.collection.createIndex({description: 'text'}, {background: true})

## Text Index

**Text indexes an efficient alternative to regex search**:
Essentially text is a special term of multiple-key indexes that turn a text field to an array of text in index each element

> db.posts.createIndex({description: 'text'})
> db.posts.find({$text: {$search: 'foo'}})
> db.posts.find({$text: {$search: '"foo bar"'}}) // Consider using multi part words like "foo bar" into quote otherwise it will reflect all documents that contains 'foo' and 'bar'
> db.posts.find({$text: {$search '-foo'}}) // Exclude the word using - sign

- Sort text index

> db.posts.find({$text: {$search: 'foo bar'}} ,{score: {$meta: 'textScore'}}).sort({score: {$meta: 'textScore' }}) // By adding score projection using \$meta and sort based on it

- Create combined text indexes _Text indexes are expesive so consider following index not recommended_

> db.posts.createIndex({title: 'text', description: 'text'})

- default language, \$caseSensitive: https://docs.mongodb.com/manual/reference/text-search-languages/

  > db.collection.createIndex({ description : 'text'}, {default_language: 'german', \$caseSensitive: true } )

- weights: https://docs.mongodb.com/manual/tutorial/avoid-text-index-name-limit/#use-the-index-name-to-drop-a-text-index
  > db.collection.createIndex({title: 'text', description: 'text'}, {weights: {text: 1, description : 10}})

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

## Working with GeoSpatial

- Find places near an certain location:
  Imagine Places Contains such documents following data in `GeoJSON` format https://docs.mongodb.com/manual/reference/geojson/:
  ```json
  [
    {
      "location": {
        "type": "Point",
        "coordinates": [-122.2, 21]
      }
    }
  ]
  ```

First we need to Add GeoSpatial index:

> db.places.createIndex({location : "2dsphere"})

Then we can query `$near` places:

> db.places.find({location : {\$near: {\$geometry : {type: 'Point', coordinates : [-3213.12, 312.23], $maxDistance: 500, $minDistance: 40}}}}) // min and max Distance is in meter

- Find place in a certain polygon:

> const p1 = [12,12], p2= [32,43] , p3=[12, 12], p4=[21,43] // Imagine we storing valid latitude and longitude for each point

> db.palces.find({location: {$geoWithin: {$geometry: {type: 'Polygon', coordinates: [[p1,p2,p3,p4,p1]]}}}}) // insert the first point _p1 in this case_ to close the polygon

- Find out if location is insider the area

> const p1 = [12,12], p2= [32,43] , p3=[12, 12], p4=[21,43] // Imagine we storing valid latitude and longitude for each point

> db.polygons.insertOne({name: 'my polygon', polygon: {type: 'Polygon', coordinates: [[p1,p2,p3,p4,p1]]}})
> db.polygon.createIndex({polygon: '2dsphere'})

> db.polygon.find({ polygon : {$geoIntersects: {$geometry: {type: 'Point', coordinates: [2141.312, 3214321.1]}}}}) // This returns all the polygon that this point is intersects with it also can be used to check a polygon intersects with another one

> Finding places within a certain radius

> db.places.find({location: {$geoWithin: {$centerSphere: [[-122.32, 431], 1 / 6378.1]}}) // First argument is center coordinates of sphere and second argument is radius in kilometer

## Aggregation framework

- \$match:

  > db.persons.aggregate([{$match:{$or: [ {'dob.age': {$gte: 50}}, {'dob.age': {$lte: 20}}]}}]).pretty()

- \$group:

  > db.persons.aggregate([{$group: {\_id: '$location.state', totalCount: {$sum: 1}}}, {$sort: {totalCount: 1}}])
  > db.friends.aggregate([{ $group: { \_id: '$age', allHobbies: {$push: '$hobbies'}}}]) // $push element to group array; Use $addtoSet in case you don't want duplicate values

* \$project:

  > db.persons.aggregate([{$project: {gender: 1, fullName: {$concat: ['$name.first', ' ', '$name.last']}, 'dob.age': 1}}]).pretty()

  convert

  > db.persons.aggregate([{ $project: { \_id: 0, location: { type: 'Point', coordinates: [{ $convert: { input: '$location.coordinates.longitude', to: 'decimal'}}, { $convert: { input: '\$location.coordiantes.latitude', to: 'decimal', onError: 0, onNull: 0}}]}}}]) // \$convert: https://docs.mongodb.com/manual/reference/operator/aggregation/convert/

  > db.persons.aggregate([{$project: { birthDate: {$convert: {input: '$dob.date', to: 'date', onNull: new Date(), onError: new Date()}}, age: '$dob.age'}}])

  isWeekYear

  > db.persons.aggregate([{$project: {birthDate: {$toDate: '$dob.date'}}}, {$group: {\_id: {birthYear: {$isoWeekYear: '$birthDate'}}, numsPersons: {$sum: 1}}}, {$sort: {numsPerson: -1}}])

  slice

  > db.friends.aggregate([{$project: {\_id: 0, examScores: {$slice: ['$examScores', 1, 1]}}}]) // [array to slice, start from position, slice to]

  size Length of the array

  > db.friends.aggregate([{$project: {\_id: 0, name: 1 ,scoresSize: { $size: '$examScores' }}}])

filter

> db.friends.aggregate([{$project: {\_id: 0, scores: { $filter: { input: '$examScores', as: 'sc', cond: { $gt: ['$$sc.score', 60] } } } }}])

max

> db.friends.aggregate([{$project: {\_id: 0, name: 1, maxScore: {$max: '$examScores.score'}}}])

- \$bucket: https://docs.mongodb.com/manual/reference/operator/aggregation/bucket/index.html

> db.persons.aggregate([{$bucketAuto: { groupBy: '$dob.age', buckets: 5, boundaries: [20, 30, 40], output: { numsPerson: {$sum: 1 }, average: {$avg: '\$dob.age'}}}}])

- \$bucketAuto

> db.persons.aggregate([{$bucketAuto: { groupBy: '$dob.age', buckets: 5, output: { numsPerson: {$sum: 1 }, average: {$avg: '$dob.age'}}}}])

- \$out Writing aggregation result into a new collection

> db.friends.aggregation([{$project: {\_id: 0, name: 1}}, {$out: 'transformedFriends'}])

## Working with Numbers

- int32 -2,147,483,648 to 2,147,483,647
- int64 -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
- double64 Mongo shell store store numbers in double64 format by default because it's use javascript
  > db.numtest.insertOne({a: 1}) // Since we're using mongo shell 1 stores as double64
- double128 high precision double

**In all of the following cases you can use both number and string as `n` argument, But it recommended to use string _Essentially beacuse number in javascript have double64 limitation_**

- NumberInt(n) int32

  > db.numtest.insertsOne({a: NumberInt("23")})

- NumberLong(n) int64

  > db.numtest.insertsOne({a: NumberLong("123123"))

- Doing Math
  Always consider to use same type in calculation for exact result for example:

  > db.numtest.insertOne({a: NumberLong("12")}) // Storing 12 as int64
  > db.numtest.UpdateOne({}, {\$inc: NumberLong("1")}) // Using also int64 to increment 12

- NumberDecimal(n) Decimal128bit _High precision doubles_
  > db.numtest.insertOne({a: NumberDecimal("2121.122")})

## Security

Authentication is disabled by default:

### Running enabled authentication mongod server

> mongod --auth

mongo image:

> docker run -d --name mongodb mongo --auth

### Enable Access Control

https://docs.mongodb.com/manual/tutorial/enable-authentication/

Create the user administrator:

```js
use admin
db.createUser(
  {
    user: "admin",
    pwd:  "admin",
    roles: ["userAdminAnyDatabase"]
  }
)
```

Connect and authenticate as the user administrator:

```js
use admin
db.auth("admin", "admin")
```

or

> mongo --port 27017 --authenticationDatabase "admin" -u "admin" -p "admin"

**Caveates** You have to logout from previous user before login as new user using `db.logout()`

another examples

```js
use db shop

db.createUser(
  {
    user: "dev",
    pwd:  "dev",
    roles: ["readWrite"]
  }
)

use admin

db.logout() // logout from admin

use shop

db.auth('dev', 'dev')

db.collection.insertOne({name: 'foo'})
```

## UpdateUser

```js
use db admin

db.auth('admin', 'admin')

use db shop

db.createUser(
  {
    user: "dev",
    pwd:  "dev",
    roles: ["readWrite"]
  }
)

use admin

db.logout() // logout from admin

use shop

db.auth('dev', 'dev')

db.collection.insertOne({name: 'foo'})


// Assume we want to also add readWrite to post db to 'dev' user


db.logout() // logout from dev

use admin

db.auth('admin', 'admin')

use shop

db.updateUser('dev', {
  roles: ['readWrite', { db: 'post', role: 'readWrite'}],
  })

use admin

db.logout() // logout from admin

use shop

db.auth('dev, 'dev')

use post

db.collection.insertOne({name: 'foo'})

db.getUser('dev')

{ "_id" : "shop.dev", "userId" : UUID("93091dc5-6736-47ee-8623-ee0e4dd44e51"), "user" : "dev", "db" : "shop", "roles" : [ { "role" : "readWrite", "db" : "shop" }, { "role" : "readWrite", "db" : "post" } ], "mechanisms" : [ "SCRAM-SHA-1", "SCRAM-SHA-256" ]}

```

## To Read

- [] How mongo actually works behind the scene
- [] **How to design a efficient Collection schema** (Database architecture in general)
- [] MongoDB nesting limitation sees like 100 level of embedded and overall document size should be under 16mb
- [x] https://www.w3resource.com/mongodb-exercises/#PracticeOnline
- [] Validation actions in details
- [] db.command()
- [] write Concern and journal
- [] **Indexing strategies https://docs.mongodb.com/manual/applications/indexes/**
- [] **When to Use Multi Key indexes**

## Sundry

- copy files/folders between a container and the local filesystem

  > docker cp ./mock.json mongodb:/user/mock # copy mock.json from local to mongodb container under /user/mock directory it is possible to copy from container to local

- [ERD](https://www.lucidchart.com/pages/ER-diagram-symbols-and-meaning)
