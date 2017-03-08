import props from 'ramda/src/props';
import { HigherOrderComponent } from './types';

export interface SinksWithSourcesMapper<T> {
  (...sinksAndSources: T[]): { [name: string]: T };
}

export interface MapSinksWithSources<T> {
  ( sinkNames: string | string[],
    sourceNames: string | string[],
    mapper: SinksWithSourcesMapper<T> ): HigherOrderComponent<T>;
}

const mapSinksWithSources: MapSinksWithSources<any> =
  (sinkNames, sourceNames, mapper) =>
    BaseComponent =>
      sources => {
        const sinks = BaseComponent(sources);

        return {
          ...sinks,
          ...mapper(
            ...props([].concat(sinkNames), sinks),
            ...props([].concat(sourceNames), sources),
          ),
        };
      };

export default mapSinksWithSources;
