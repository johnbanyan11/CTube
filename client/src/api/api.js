import axios from "axios";

export const API = axios.create({
  // baseURL: "https://cors-anywhere.herokuapp.com/https://ctube.onrender.com",
  baseURL: "http://localhost:8001/api",
});
