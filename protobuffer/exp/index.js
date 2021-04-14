const Schema = require("./person");

const person = new Schema.person();
person.setName("Foo");
person.setId(1);
person.setEmail("foo@foo.com");


console.info(person);
