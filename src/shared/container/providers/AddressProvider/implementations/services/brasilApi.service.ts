import axios from "axios";

export const apiBrailApi = axios.create({
  baseURL: "https://brasilapi.com.br/api",
});
