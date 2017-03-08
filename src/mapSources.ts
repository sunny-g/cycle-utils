import props from 'ramda/src/props';
import { HigherOrderComponent } from './types';

export interface SourcesMapper<T> {
  (...sources: T[]): { [name: string]: T };
}

export interface MapSources<T> {
  ( sourceNames: string | string[],
    mapper: SourcesMapper<T> ): HigherOrderComponent<T>;
}

const mapSources: MapSources<any> = (sourceNames, mapper) =>
  BaseComponent =>
    sources =>
      BaseComponent({
        ...sources,
        ...mapper(...(props([].concat(sourceNames), sources))),
      });

export default mapSources;
