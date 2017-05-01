import compose from 'ramda/src/compose';
import { SourcesMapper } from './mapSources';
import { SinksWithSourcesMapper } from './mapSinksWithSources';
import { isPlainObject, pluckSources, pluckSinks } from './util';
import { HigherOrderComponent } from './interfaces';

export interface MapSourcesAndSinks {
  ( sourceNames: string | string[],
    sourcesMapper: SourcesMapper,
    sinkNames: string | string[],
    sinksMapper: SinksWithSourcesMapper ): HigherOrderComponent;
}

const mapSourcesAndSinks: MapSourcesAndSinks =
  (sourceNames, sourcesMapper, sinkNames, sinksMapper) =>
    BaseComponent =>
      sources => {
        const sourcesOfInterest = pluckSources(sourceNames, sources);
        const newSources = sourcesMapper(...sourcesOfInterest);

        if (!isPlainObject(newSources)) {
          throw new Error('Sources mapper must return a plain object');
        }

        const sinks = BaseComponent({
          ...sources,
          ...newSources,
        });

        const sinksOfInterest = pluckSinks(sinkNames, sinks);
        const newSinks = sinksMapper(...sinksOfInterest, newSources);

        if (!isPlainObject(newSinks)) {
          throw new Error('Sinks mapper must return a plain object');
        }

        return {
          ...sinks,
          ...newSinks,
        };
      }

export default mapSourcesAndSinks;
