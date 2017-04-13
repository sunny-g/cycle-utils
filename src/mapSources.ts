import { pluckSources } from './util';
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
    sources =>
      BaseComponent({
        ...sources,
        ...mapper(...pluckSources(sourceNames, sources)),
      });

export default mapSources;
