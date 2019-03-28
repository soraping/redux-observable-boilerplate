export * from "./user";

export interface IBaseAction<T> {
  type: string;
  payload: T;
}
