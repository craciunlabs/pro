declare module 'react' {
  export = React;
  export as namespace React;
}

declare namespace React {
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);

  type Key = string | number;

  interface Component<P = {}, S = {}> {
    render(): ReactNode;
    props: Readonly<P>;
    state: Readonly<S>;
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
  }

  type ReactNode = ReactElement | string | number | Iterable<ReactNode> | ReactPortal | boolean | null | undefined;

  interface ReactPortal {
    key: null | string;
    children: ReactNode;
  }

  interface MouseEvent<T = Element> {
    preventDefault(): void;
    currentTarget: T;
  }

  interface FC<P = {}> {
    (props: P): ReactElement<any, any> | null;
    displayName?: string;
  }
} 