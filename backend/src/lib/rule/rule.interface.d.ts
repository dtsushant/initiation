// rules.interface.d.ts

export interface RuleInput {
    getFieldMetadata();
}

export interface RuleOutput {
    getFieldMetadata();
}

export interface RuleMeta {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt?: string;
    tags?: string[];
}

export interface SubProcess {
    id: string;
    name: string;
    description?: string;
    run: (input: RuleInput) => Promise<RuleOutput>;
}

export interface RuleProcess {
    subProcesses: SubProcess[];

    executeFirst: (input: RuleInput) => Promise<RuleOutput>;
    executeAll: (input: RuleInput) => Promise<RuleOutput[]>;
}

export interface RuleDocument<T extends RuleInput, U extends RuleOutput> {
    meta: RuleMeta;
    process: RuleProcess;
    input: T;
    output?: U;
}
