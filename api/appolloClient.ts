import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const AppClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.EXPO_PUBLIC_API_URL,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default AppClient;
