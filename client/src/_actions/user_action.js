import axios from "axios";
import { AUTH_USER, LOGIN_USER, SIGNUP_USER } from "./types";

export function loginUser(dataToSubmit) {
  const requset = axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => response.data);
  return {
    type: LOGIN_USER,
    payload: requset,
  };
}
export function signUpUser(dataToSubmit) {
  const requset = axios
    .post("/api/users/signup", dataToSubmit)
    .then((response) => response.data);
  return {
    type: SIGNUP_USER,
    payload: requset,
  };
}

export function auth(dataToSubmit) {
  const requset = axios
    .get("/api/users/auth", dataToSubmit)
    .then((response) => response.data);
  return {
    type: AUTH_USER,
    payload: requset,
  };
}
