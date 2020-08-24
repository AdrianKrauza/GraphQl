
const { ApolloServer, gql } = require('apollo-server');
const { readFileSync } = require('fs');
const { prisma } = require('./generated/prisma-client');


const resolvers = {
  Query: {
    notes: async() => await prisma.notes(),
    note:async(parent,args,context,info)=> await prisma.note({id:args.id})
  },
  Mutation: {
    createNote: async(parent, args) => {
      const note = { title: args.title, description: args.description};
      return prisma.createNote(note);
    },
    deleteNote: async(parent, args) => await prisma.deleteNote({id:args.id}),
    updateNote: async(parent, {id,title,description}) => {
      const note = await prisma.note({id:id})
      const noteData = {
        title:title ? title : note.title,
        description:description ? description : note.description
      }
      return await prisma.updateNote({
      data:noteData,
      where:{id:id}
    })}
  }

}
const server = new ApolloServer({
  typeDefs: gql`${readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});