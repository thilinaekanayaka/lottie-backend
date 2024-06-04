const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const mongoose = require('mongoose');

const main = async () => {
  mongoose.connect('mongodb://localhost:27017/lottie-manager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const AnimationSchema = new mongoose.Schema({
    name: String,
    url: String,
    metadata: String,
  });

  const Animation = mongoose.model('Animation', AnimationSchema);

  const typeDefs = gql`
  scalar Upload

  type Animation {
    id: ID!
    name: String!
    url: String!
    metadata: String
  }

  type Query {
    animations: [Animation]
  }

  type Mutation {
    uploadAnimation(name: String!, file: Upload!): Animation
  }`;

  const resolvers = {
    Upload: graphqlUploadExpress.Upload,

    Query: {
      animations: async () => {
        return await Animation.find();
      },
    },
    Mutation: {
      uploadAnimation: async (parent, { name, file }) => {
        const { createReadStream, filename, mimetype, encoding } = await file;

        const stream = createReadStream();
        const out = require('fs').createWriteStream(`./uploads/${filename}`);
        stream.pipe(out);
        await finished(out);

        const animation = new Animation({
          name,
          url: `/uploads/${filename}`,
          metadata: '{}',
        });

        await animation.save();
        return animation;
      },
    },
  };

  const { finished } = require('stream/promises');

  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

main();
