import { Decoder, object, string } from "decoders";
import axios from "axios";
import { store } from "/src/initiation/store";
import { loadUser } from "/@/initiation/components/auth/Auth.slice.ts";

export interface PublicUser {
  email: string;
}

export interface User extends PublicUser {
  token: string;
}

export const userDecoder: Decoder<User> = object({
  email: string,
  token: string,
});

export const userResponseDecoder: Decoder<{ user: User }> = object({
  user: userDecoder,
});

export interface UserSettings extends PublicUser {
  email: string;
  password: string | null;
}

export function loadUserIntoApp(user: User) {
  localStorage.setItem("token", user.token);
  axios.defaults.headers.Authorization = `Token ${user.token}`;
  store.dispatch(loadUser(user));
}
