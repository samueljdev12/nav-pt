export interface YourStopsCardData {
  stopsByRadius: {
    edges: {
      node: {
        stop: {
          gtfsId: string;
          name: string;
          vehicleMode: string;
          routes: {
            shortName: string;
            longName: string;
            mode: string;
            color: string;
            textColor: string;
          }[];
        };
      };
    }[];
  };
}
