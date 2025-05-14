import {
  array,
  boolean,
  date,
  Decoder,
  either,
  lazy,
  number,
  record,
  string,
} from "decoders";

export const dynamicShapeDecoder: Decoder<unknown> = lazy(() =>
  either(
    string,
    either(
      number,
      either(
        boolean,
        either(
          date,
          either(array(dynamicShapeDecoder), record(dynamicShapeDecoder)),
        ),
      ),
    ),
  ),
);
