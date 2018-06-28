import {IconName} from "@blueprintjs/core";
import {AxiosResponse} from 'axios';

export type TStringOrUndefined = string | undefined;

export type TStringOrNumber = string | number;

export type TIconNameOrJSX = IconName | JSX.Element;

export type TFunction<T, R> = (t: T) => R;

export type TPromiseFunction<T, R> = (t: T) => Promise<Array<AxiosResponse<R[]>>>;

export type TBiFunction<T, U, R> = (t: T, u: U) => R;

export type TBiPromiseFunction<T, U, R> = (t: T, u: U) => Promise<Array<AxiosResponse<R[]>>>;

export type TTriFunction<T, U, V, R> = (t: T, u: U, v: V) => R;

export type TTriPromiseFunction<T, U, V, R> = (t: T, u: U, v: V) => Promise<Array<AxiosResponse<R[]>>>;
