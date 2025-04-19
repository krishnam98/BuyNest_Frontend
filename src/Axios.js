import axios from "axios";

const instance = axios.create(
  {
    baseURL: "http://127.0.0.1:5001/clone-6b1d5/us-central1/api", // THE API (CLOUD FUNCTION) URL
  },
  {}
);

export default instance;
