import props from 'ramda/src/props';
import { HigherOrderComponent } from './types';

export interface SinksMapper<T> {
  (...sinks: T[]): { [name: string]: T };
}

export interface MapSinks<T> {
  ( sinkNames: string | string[],
    mapper: SinksMapper<T> ): HigherOrderComponent<T>;
}

const mapSinks: MapSinks<any> = (sinkNames, mapper) =>
  BaseComponent =>
    sources => {
      const sinks = BaseComponent(sources);

      return {
        ...sinks,
        ...mapper(...props([].concat(sinkNames), sinks)),
      };
    };

export default mapSinks;
