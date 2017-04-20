import compose from 'ramda/src/compose';
import { SourcesMapper } from './mapSources';
import { SinksWithSourcesMapper } from './mapSinksWithSources';
import { pluckSources, pluckSinks } from './util';
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
        const newSources = {
          ...sources,
          ...sourcesMapper(...sourcesOfInterest),
        };

        const sinks = BaseComponent(newSources);
        const sinksOfInterest = pluckSinks(sinkNames, sinks);

        return {
          ...sinks,
          ...sinksMapper(...sinksOfInterest, newSources),
        };
      }

export default mapSourcesAndSinks;
