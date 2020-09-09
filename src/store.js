import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { get, set } from "segmented-property";

export const StoreContext = createContext();

export function useStore() {
  const store = useContext(StoreContext);

  if (!store) throw new Error("Store: missing context");

  return store;
}

export function useRef(path) {
  const store = useStore();
  const [state, setState] = useState(store.get(path));

  const setValue = useCallback((value) => store.set(path, value), [
    store,
    path,
  ]);

  useEffect(() => store.ref(path).subscribe(setState), [path, store]);

  return { value: state, setValue };
}

export function StoreProvider({ children, initialState }) {
  const store = createStore(initialState);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

function createStore(initialState) {
  const subscribers = [];

  let state = initialState || {};

  const store = {
    get(path) {
      return get(state, path);
    },

    ref(path) {
      return ref(store, path);
    },

    set(path, value) {
      state = set(state, path, value);
      subscribers.forEach((fn) => fn());
    },

    subscribe,
  };

  return store;

  function subscribe(fn) {
    subscribers.push(fn);

    return () => {
      const idx = subscribers.indexOf(fn);

      if (idx > -1) {
        subscribers.splice(idx, 1);
      }
    };
  }
}

function ref(store, path) {
  return {
    get() {
      return store.get(path);
    },

    set(value) {
      store.set(path, value);
    },

    subscribe,
  };

  function subscribe(fn) {
    let value = store.get(path);

    return store.subscribe(() => {
      const prevValue = value;

      value = store.get(path);

      if (prevValue !== value) {
        fn(value);
      }
    });
  }
}
