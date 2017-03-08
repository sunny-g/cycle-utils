import { FSA } from 'flux-standard-action';
import { Stream } from 'most';

export type Sources<T> = {
  [name: string]: T;
}

export type Sinks<T> = {
  [name: string]: T;
}

export type Component<T> = {
  (sources: Sources<T>): Sinks<T>;
}

export interface HigherOrderComponent<T> {
  (BaseComponent: Component<T>): Component<T>;
}

export interface HigherOrderComponentFactory<T> {
  (...options: any[]): HigherOrderComponent<T>;
}

export type HOC<T> = HigherOrderComponent<T>;

export type HOCFactory<T> = HigherOrderComponentFactory<T>;

/*----------------------------------------
 ----------------------------------------*/

export type Props = { [prop: string]: any };
export type PropsStream = Stream<Props>;

export type ActionStream = Stream<FSA<any, any>>;
