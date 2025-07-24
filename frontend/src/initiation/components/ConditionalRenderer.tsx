import {
  ConditionalExpression,
  ConditionalMeta,
  evaluateCondition,
} from "xingine";
import React, { useMemo } from "react";
import { RenderComponent, useSharedState } from "xingine-react";
//import {RenderComponent} from "/@/initiation/layouts/custom/Component.utils.tsx";

interface ConditionalMetaExtended extends ConditionalMeta {
  scope?: Record<string, unknown>;
}

export function extractFieldsFromCondition(
  condition?: ConditionalExpression,
): string[] {
  const fields = new Set<string>();

  const walk = (cond?: ConditionalExpression) => {
    if (!cond) return;

    if ("field" in cond && typeof cond.field === "string") {
      fields.add(cond.field);
    }

    if ("and" in cond && Array.isArray(cond.and)) {
      cond.and.forEach(walk);
    }

    if ("or" in cond && Array.isArray(cond.or)) {
      cond.or.forEach(walk);
    }
  };

  walk(condition);
  return [...fields];
}

export function useReactiveCondition(
  condition: ConditionalExpression,
  evaluate: (
    condition: ConditionalExpression,
    state: Record<string, unknown>,
  ) => boolean,
): boolean {
  const fields = extractFieldsFromCondition(condition);

  const values: Record<string, unknown> = {};
  for (const field of fields) {
    values[field] = useSharedState(field);
  }

  return useMemo(() => {
    return evaluate(condition, values);
  }, [condition, ...fields.map((f) => values[f])]);
}
export const ConditionalRenderer: React.FC<ConditionalMetaExtended> = (
  meta,
) => {
  const { condition, trueComponent, falseComponent, scope } = meta;

  const predicate = useReactiveCondition(condition, evaluateCondition);

  const component = predicate
    ? trueComponent.meta?.component && trueComponent
    : falseComponent?.meta?.component && falseComponent;
  return <RenderComponent {...component} />;
};
