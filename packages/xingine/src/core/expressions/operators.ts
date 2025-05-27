export type Operator =
  | "eq"
  | "ne"
  | "like"
  | "ilike"
  | "in"
  | "nin"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export interface BaseFilterCondition {
  field: string;
  operator: Operator;
  value: unknown;
}

export interface GroupCondition {
  and?: SearchCondition[];
  or?: SearchCondition[];
}

export type SearchCondition = BaseFilterCondition | GroupCondition;

export type SearchQuery = GroupCondition;
