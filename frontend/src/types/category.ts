import {
  array,
  Decoder,
  lazy,
  number,
  object,
  optional,
  string,
  undefined_,
} from "decoders";

export interface Category {
  code: string;
  label?: string;
  description?: string;
  level: number;
  parentCategoryCode?: string;
  children?: Category[];
}

export interface CategorySelectTree {
  title: string;
  value: string;
  children?: CategorySelectTree[];
}

export const categoryDecoder: Decoder<Category> = lazy(() =>
  object({
    code: string,
    label: optional(string),
    description: optional(string),
    level: number,
    parentCategoryCode: optional(string),
    children: optional(array(categoryDecoder)),
  }),
);
