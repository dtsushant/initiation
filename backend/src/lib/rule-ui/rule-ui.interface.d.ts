import {FieldType} from "./rule-ui.enum";
import {RuleInput, RuleOutput, SubProcess} from "../rule/rule.interface";

export interface RuleMeta {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
    tags?: string[];
}
export interface RuleUIField {
    id:string;
    name: string;
    alias: string;
    code: string;
    type: FieldType;
}

export type RuleUIInputField = RuleUIField & {

};

export type RuleUIOutputField =RuleUIField & {

}

export interface RuleUIInput{
    id:String;
    fields:RuleUIInputField[]
}

export interface RuleUIOutput{
    id:String;
    fields:RuleUIOutputField[]
}


export interface RuleProcess {

}


export interface RuleDocument{
    meta: RuleMeta;
    input: RuleUIInput;
    output: RuleUIOutput;
    processes: RuleProcess[];
}