import { Decoder, object, string } from "decoders";
import axios from "axios";
import { store } from "/@/store";
import { loadUser } from "/@/components/app/app.slice.ts";

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

export interface UserSettings extends PublicUser {
  email: string;
  password: string | null;
}

export function loadUserIntoApp(user: User) {
  localStorage.setItem("token", user.token);
  axios.defaults.headers.Authorization = `Token ${user.token}`;
  store.dispatch(loadUser(user));
}
