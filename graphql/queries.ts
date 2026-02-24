import { gql } from "@apollo/client";

export const GET_NEARBY_STOPS = gql`
  query GetNearbyStops($lat: Float!, $lon: Float!, $radius: Int!) {
    stopsByRadius(lat: $lat, lon: $lon, radius: $radius) {
      edges {
        node {
          stop {
            gtfsId
            name
            lat
            lon
            vehicleMode
            routes {
              gtfsId
              shortName
              longName
              mode
              color
            }
          }
          distance
        }
      }
    }
  }
`;
