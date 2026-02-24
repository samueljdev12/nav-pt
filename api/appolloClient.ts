import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const AppClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://opentripplanner-production.up.railway.app/otp/routers/default/index/graphql",
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default AppClient;
