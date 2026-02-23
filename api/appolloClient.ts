import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const AppClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://api.navpt.com/graphql",
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default AppClient;
