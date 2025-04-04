import React, {memo, useEffect, useState} from 'react';
import useApiCall from '/@/hooks/userAPICall';
import {showToast} from "../../../utils/toast.ts";
import {RuleDocument, RuleMeta, RuleUIInput, RuleUIOutput} from "@rule-ui";




export const RuleDocumentPage = memo(() => {

    const [doc, setDoc] = useState<RuleDocument | null>(null);

    const { loading, makeApiCall } = useApiCall<undefined, RuleDocument>({
        endpoint: 'rules/fetch',
        method: 'GET',
        onSuccess: (data: RuleDocument) => {
            setDoc(data);
        },
        onError: (error: any) => {
            showToast.error(error?.message || 'Something went wrong');
        },
    });

    useEffect(() => {
        makeApiCall();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!doc) return <div>No data found</div>;

    return (
        <div className="p-4">
            <RuleDocumentComponent
                meta={doc.meta}
                input={doc.input}
                output={doc.output}
            />
        </div>
    );
});

const RuleMetaComponent: React.FC<RuleMeta> = ({ meta }) => (
    <div>
        <h2>{meta.name}</h2>
        <p>{meta.description}</p>
        <p>Created At: {new Date(meta.createdAt).toLocaleDateString()}</p>
        {meta.updatedAt && <p>Updated At: {new Date(meta.updatedAt).toLocaleDateString()}</p>}
        {meta.tags && (
            <ul>
                {meta.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                ))}
            </ul>
        )}
    </div>
);

const RuleUIInputComponent: React.FC<RuleUIInput> = ({ input }) => (
    <div>
        <h3>Input Fields</h3>
        {input.fields.map((field) => (
            <div key={field.id}>
                <label htmlFor={field.id}>{field.name}</label>
                <input id={field.id} name={field.alias} type={field.type} />
            </div>
        ))}
    </div>
);

// RuleUIOutput component
const RuleUIOutputComponent: React.FC<RuleUIOutput> = ({ output }) => (
    <div>
        <h3>Output Fields</h3>
        {output.fields.map((field) => (
            <div key={field.id}>
                <span>{field.name}: </span>
                <span>{/* Render output value here */}</span>
            </div>
        ))}
    </div>
);

const RuleDocumentComponent: React.FC<RuleDocument> = ({ meta, input, output }) => (
    <div>
        <RuleMetaComponent meta={meta} />
        <RuleUIInputComponent input={input} />
        <RuleUIOutputComponent output={output} />
    </div>
);



RuleDocumentPage.displayName = 'RuleDocumentPage';
