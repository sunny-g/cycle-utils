import { isPlainObject, pluckSources } from './util';
import { HigherOrderComponent } from './interfaces';

export interface SourcesMapper {
  (...sources: any[]): { [sourceName: string]: any };
}

export interface MapSources {
  ( sourceNames: string | string[],
    mapper: SourcesMapper ): HigherOrderComponent;
}

const mapSources: MapSources = (sourceNames, mapper) =>
  BaseComponent =>
    sources => {
      const newSources = mapper(...pluckSources(sourceNames, sources));

      if (!isPlainObject(newSources)) {
        throw new Error('Sources mapper must return a plain object');
      }

      return BaseComponent({
        ...sources,
        ...newSources,
      });
    }

export default mapSources;
