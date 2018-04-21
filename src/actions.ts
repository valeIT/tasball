import { ActionCreator, Dispatch, Action, Page } from "./types";

// actions

export const actions = wireActions({
  setPage: action<{ page: Page }>(),
  setPaused: action<{ paused: boolean }>(),
});

// utils

function action<PayloadType>(): ActionCreator<PayloadType> {
  const ret = (type: string) => (payload: PayloadType): Action<PayloadType> => {
    return {
      type,
      payload,
    };
  };
  // bending typing rules a bit, forgive me
  return ret as any;
}

export function dispatcher<T, U>(
  dispatch: Dispatch,
  actionCreator: (payload: T) => Action<U>,
) {
  return (payload: T) => {
    const action = actionCreator(payload);
    dispatch(action);
    return action;
  };
}

interface IMirrorInput {
  [key: string]: ActionCreator<any>;
}

type IMirrorOutput<T> = { [key in keyof T]: T[key] };

function wireActions<T extends IMirrorInput>(input: T): IMirrorOutput<T> {
  const res: IMirrorOutput<T> = {} as any;
  for (const k of Object.keys(input)) {
    res[k] = input[k](k) as any;
  }
  return res;
}