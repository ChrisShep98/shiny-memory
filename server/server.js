import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { users } from "./mockData.js";

// backticks allow us to write graphql queries
const typeDefs = `
type Query {
    getUsers: [User]
    getUserById(id: ID): User
  }

type Mutation {
    createUser(name: String!, age: Int!, isMarried: Boolean!): User
}

type User {
    id: ID
    name: String
    age: Int
    isMarried: Boolean
}

`;

const resolvers = {
  Query: {
    getUsers: () => {
      return users;
    },
    getUserById: (parent, args) => {
      const id = args.id;
      return users.find((user) => user.id === id);
    },
  },
  Mutation: {
    createUser: (parents, args) => {
      const { name, age, isMarried } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        age,
        isMarried,
      };
      users.push(newUser);
    },
  },
};

// Setting up Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`server running at: ${url}`);

// Query: GET | Mutation: POST, PUT, DELETE
// typeDefs = will represent the type definitions for our queries and mutations
// Resolvers = are the methods that will execute our querys and mutations
