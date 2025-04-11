import { Err, Ok, Result } from "@hqoss/monads";
import axios, { AxiosError } from "axios";
import { GenericErrors, genericErrorsDecoder } from "../types/error";
import { User, userDecoder } from "/@/types/auth";
import { object } from "decoders";

axios.defaults.baseURL = "/api";

export async function login(
  email: string,
  password: string,
): Promise<Result<User, GenericErrors>> {
  try {
    const { data } = await axios.post("/users/users/login", {
      user: { email, password },
    });
    console.log("the data", JSON.stringify(data));

    console.log(object({ user: userDecoder }).verify(data));
    return Ok(object({ user: userDecoder }).verify(data).user);
  } catch (error) {
    console.log("the error here is", error);
    const axiosError = error as AxiosError;
    const err = object({ errors: genericErrorsDecoder }).verify(
      axiosError.response?.data,
    ).errors;
    return Err<User, GenericErrors>(err);
  }
}

export async function getUser(): Promise<User> {
  const { data } = await axios.get("users/user");
  return object({ user: userDecoder }).verify(data).user;
}
