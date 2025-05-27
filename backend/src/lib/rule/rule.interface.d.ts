// rules.interface.d.ts

export interface RuleInput {
    getFieldMetadata();
}

export interface RuleOutput {
    getFieldMetadata();
}

export interface SubProcess {
    id: string;
    name: string;
    description?: string;
    run: (input: RuleInput) => Promise<RuleOutput>;
}


export interface RuleDefinition<T extends RuleInput, U extends RuleOutput> {

}
