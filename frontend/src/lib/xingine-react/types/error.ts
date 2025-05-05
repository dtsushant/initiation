import { record, string, either } from "decoders";

export type GenericErrors = Record<string, string | Record<string, string>>;

export const genericErrorsDecoder = record(either(string, record(string)));
