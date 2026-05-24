import axios from "axios";

const api = axios.create({
  baseURL: "https://oneminuteart.onrender.com/api",
});

export default api;