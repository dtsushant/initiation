import { Decoder, object } from "decoders";
import { Err, Ok, Result } from "@hqoss/monads";
import { GenericErrors, genericErrorsDecoder } from "/@/types/error.ts";
import axios from "axios";

axios.defaults.baseURL = "/api";
export async function post<T, U>(
  form: T,
  decoder: Decoder<U>,
  uri: string,
): Promise<Result<U, GenericErrors>> {
  try {
    const { data } = await axios.post(uri, form);
    return Ok(decoder.verify(data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = object({ errors: genericErrorsDecoder }).verify(
        error.response?.data,
      ).errors;
      return Err<U, GenericErrors>(err);
    } else {
      return Err<U, GenericErrors>(error);
    }
  }
}

export async function get<U>(decoder: Decoder<U>, uri: string): Promise<U> {
  const { data } = await axios.get(uri);
  return decoder.verify(data);
}
