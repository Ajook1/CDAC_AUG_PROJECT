import axios from "axios";

const API = axios.create({
  baseURL: "http://10.127.12.103:4000",
});

export default API;
