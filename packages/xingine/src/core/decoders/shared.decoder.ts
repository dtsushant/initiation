import { array, either, record, string } from "decoders";

export const dynamicShapeDecoder = record(
  either(
    string,
    either(array(string), either(record(string), array(record(string)))),
  ),
);
