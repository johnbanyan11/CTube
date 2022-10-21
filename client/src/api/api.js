import axios from "axios";

export const API = axios.create({
  baseURL: "https://ctube-server.herokuapp.com/api",
});
