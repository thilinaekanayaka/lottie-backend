const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const main = async () => {
  const typeDefs = gql`
    type Query {
      animations: [Animation]
    }
  
    type Animation {
      id: ID!
      name: String!
      url: String!
      metadata: String
    }
  
    type Mutation {
      uploadAnimation(name: String!, data: String!): Animation
    }
  `;

  // Define your resolvers
  const resolvers = {
    Query: {
      animations: async () => {
        // Fetching animations from the database
        // Placeholder for now
        return [
          { id: '1', name: 'Animation 1', data: 'qwerqwerwqerwqer', metadata: '{}' },
        ];
      },
    },
    Mutation: {
      uploadAnimation: async (parent, { name, data }) => {
        // Handling file upload and saving animation to the database
        // Placeholder for now
        const animation = { id: '2', name, data: 'qewrwqerwqerwqre', metadata: '{}' };
        return animation;
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();
  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

main();
