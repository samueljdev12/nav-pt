import { gql } from "@apollo/client";

export const GET_NEARBY_STOPS = gql`
  query GetNearbyStops(
    $lat: Float!
    $lon: Float!
    $radius: Int!
    $first: Int = 3
  ) {
    stopsByRadius(lat: $lat, lon: $lon, radius: $radius, first: $first) {
      edges {
        node {
          stop {
            gtfsId
            name
            vehicleMode
            routes {
              shortName
              longName
              mode
              color
              textColor
            }
          }
        }
      }
    }
  }
`;
