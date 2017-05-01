import { isPlainObject, pluckSources, pluckSinks } from './util';
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
        const newSinks = mapper(
          ...sinksOfInterest,
          ...sourcesOfInterest,
        );

        if (!isPlainObject(newSinks)) {
          throw new Error('Sinks mapper must return a plain object');
        }

        return {
          ...sinks,
          ...newSinks,
        };
      };

export default mapSinksWithSources;
