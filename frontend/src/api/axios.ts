import axios from "axios";

const api = axios.create({
  baseURL: "https://thermoluminescent-carletta-asbestoidal.ngrok-free.dev",
  withCredentials: true,
});

export default api;
