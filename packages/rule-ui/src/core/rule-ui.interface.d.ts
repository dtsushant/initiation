import { FieldType } from "./rule-ui.enum";

export interface RuleMeta {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
}
export interface RuleUIField {
  id: string;
  name: string;
  alias: string;
  code: string;
  type: FieldType;
}

export type RuleUIInputField = RuleUIField & {};

export type RuleUIOutputField = RuleUIField & {};

export interface RuleUIInput {
  id: string;
  fields: RuleUIInputField[];
}

export interface RuleUIOutput {
  id: string;
  fields: RuleUIOutputField[];
}

export interface RuleProcess {
  placeholder: string;
}

export interface RuleDocument {
  meta: RuleMeta;
  input: RuleUIInput;
  output: RuleUIOutput;
  processes?: RuleProcess[];
}
