/* eslint-disable @typescript-eslint/no-explicit-any */
// Shim to support server-function syntax in a pure client-side SPA environment.
export function useServerFn<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

export function createServerFn(options?: any) {
  return {
    inputValidator<TInput>(validatorFn: (input: any) => TInput) {
      return {
        handler<TResult>(handlerFn: (args: { data: TInput }) => Promise<TResult>) {
          // Simply call the handler function directly on the client side
          return async (args: { data: TInput }) => {
            return handlerFn(args);
          };
        },
      };
    },
  };
}
