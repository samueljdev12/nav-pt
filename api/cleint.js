import axios from "axios";

const appClient = axios.create({
  baseURL: process.env.EXPO_BASE_URL,
  timeout: 10000,
});

export default appClient;
