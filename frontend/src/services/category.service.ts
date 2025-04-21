import axios, { AxiosError } from "axios";
import {
  Category,
  categoryDecoder,
  CategoryFormFields,
} from "/@/types/category.ts";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "/@/types/error.ts";
import { Decoder, object } from "decoders";
import { User, userDecoder } from "/@/types/auth.ts";

export async function getCategory(
  categoryCode: string,
): Promise<Category | undefined> {
  try {
    const { data } = await axios.get(`categories/${categoryCode}`);
    if (!data || Object.keys(data).length === 0) {
      console.log("No category data returned");
      return undefined;
    }
    return categoryDecoder.verify(data);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error("Axios error:", e.message, e.response?.data);
    } else {
      console.error("Unknown error:", e.message);
    }
  }
  return undefined;
}

export async function getAllCategory(): Promise<Category[]> {
  throw Error("Not implemented");
}

export async function saveCategory(
  form: CategoryFormFields,
): Promise<Result<Category, GenericErrors>> {
  throw Error("Not implemented");
}

export async function saveForm<T, U>(
  form: T,
  baseUrl: string,
  decoder: Decoder<U>,
): Promise<Result<U, GenericErrors>> {
  try {
    const { data } = await axios.get(baseUrl);

    return Ok(decoder.verify(data));
  } catch (error) {
    const axiosError = error as AxiosError;
    const err = object({ errors: genericErrorsDecoder }).verify(
      axiosError.response?.data,
    ).errors;
    return Err<User, GenericErrors>(err);
  }
}
