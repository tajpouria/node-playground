const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'root',
    database : 'root',
		debug: true
  }
});

const typeDefs = gql`
  type Query {
    hello: String
		books: [String]!
  }
`;
 
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
		books: async () => {
			try {
				const books = await knex.select().table('books')
				console.info(books)
				return ["mock"]
			} catch(err){
			}
		}
  },
};
 
const server = new ApolloServer({ typeDefs, resolvers });
 
const app = express();
server.applyMiddleware({ app });
 
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)

