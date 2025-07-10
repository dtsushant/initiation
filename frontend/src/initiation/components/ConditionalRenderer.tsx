import { ConditionalMeta, evaluateCondition } from "xingine";
import React, { useEffect, useMemo, useState } from "react";
import { getDefaultInternalComponents, useXingineContext } from "xingine-react";

interface ConditionalMetaExtended extends ConditionalMeta {
  scope?: Record<string, unknown>;
}
export const ConditionalRenderer: React.FC<ConditionalMetaExtended> = (
  meta,
) => {
  const compMap = getDefaultInternalComponents();
  const { panelControl } = useXingineContext();
  const { headerActionContext } = panelControl;
  const { condition, trueComponent, falseComponent, scope } = meta;
  const [predicate, setPredicate] = useState(false);

  const combinedScope = useMemo(
    () => ({
      headerActionContext,
      ...scope,
    }),
    [headerActionContext, scope],
  );

  useEffect(() => {
    //  console.info("evaluating", condition, "with scope", combinedScope);
    const result = evaluateCondition(condition, {
      ...headerActionContext,
      ...scope,
    });
    console.info("evaluating", condition, " result:", result);
    setPredicate(result);
  }, [headerActionContext, scope, condition]);
  //  const combinedScope = {headerActionContext, ...scope};
  // const predicate = evaluateCondition(condition, combinedScope);

  const Component = predicate
    ? trueComponent.meta?.component && compMap[trueComponent.meta.component]
    : falseComponent?.meta?.component && compMap[falseComponent.meta.component];

  const props = predicate
    ? trueComponent.meta?.properties
    : falseComponent?.meta?.properties;

  return Component && <Component {...props} />;
};
