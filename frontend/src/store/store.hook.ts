import { useEffect, useState } from "react";
import { State, store } from "/@/store/index.ts";

export function useStoreWithInitializer<T>(
  getter: (state: State) => T,
  initializer: () => unknown,
) {
  const [state, setState] = useState(getter(store.getState()));
  //console.log("the initializer",initializer);
  useEffect(() => {
    const unsubscribe = store.subscribe(() =>
      setState(getter(store.getState())),
    );
    console.log("initializing the state", initializer());
    initializer();
    console.log("the state here is ", state.constructor);
    return unsubscribe;
  }, []);
  return state;
}

export function useStore<T>(getter: (state: State) => T) {
  return useStoreWithInitializer(getter, () => {});
}
