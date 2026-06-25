// Shim to support server-function syntax in a pure client-side SPA environment.
export function useServerFn<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

export function createServerFn(options?: any) {
  return {
    inputValidator(validatorFn: any) {
      return {
        handler(handlerFn: any) {
          // Simply call the handler function directly on the client side
          return async (args: any) => {
            return handlerFn(args);
          };
        }
      };
    }
  };
}
