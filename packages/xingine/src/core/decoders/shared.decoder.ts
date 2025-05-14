import {
  array,
  boolean,
  Decoder,
  either,
  lazy,
  number,
  record,
  string,
} from "decoders";

/*
export const dynamicShapeDecoder = either(
    string,
    record(
      either(
        string,
        either(array(string), either(record(string), array(record(string)))),
      ),
    )
);
*/

export const dynamicShapeDecoder: Decoder<unknown> = lazy(() =>
  either(
    string,
    either(
      number,
      either(
        boolean,
        either(array(dynamicShapeDecoder), record(dynamicShapeDecoder)),
      ),
    ),
  ),
);
