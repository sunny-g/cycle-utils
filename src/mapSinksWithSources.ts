import { pluckSources, pluckSinks } from './util';
import { HigherOrderComponent } from './interfaces';

export interface SinksWithSourcesMapper {
  (...sinksAndSources: any[]): { [name: string]: any };
}

export interface MapSinksWithSources {
  ( sinkNames: string | string[],
    sourceNames: string | string[],
    mapper: SinksWithSourcesMapper ): HigherOrderComponent;
}

const mapSinksWithSources: MapSinksWithSources =
  (sinkNames, sourceNames, mapper) =>
    BaseComponent =>
      sources => {
        const sinks = BaseComponent(sources);

        const sourcesOfInterest = pluckSources(sourceNames, sources);
        const sinksOfInterest = pluckSinks(sinkNames, sinks);

        return {
          ...sinks,
          ...mapper(
            ...sinksOfInterest,
            ...sourcesOfInterest,
          ),
        };
      };

export default mapSinksWithSources;
