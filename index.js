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
      uploadAnimation(name: String!): Animation
    }
  `;

  // Define your resolvers
  const resolvers = {
    Query: {
      animations: async () => {
        // Fetch animations from your database
        // Placeholder for now
        return [
          { id: '1', name: 'Animation 1', url: '/animations/animation1.json', metadata: '{}' },
        ];
      },
    },
    Mutation: {
      uploadAnimation: async (parent, { name }) => {
        // Handle file upload and save animation to your database
        // Placeholder for now
        const animation = { id: '2', name, url: '/animations/new-animation.json', metadata: '{}' };
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
