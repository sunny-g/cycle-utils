import compose from 'ramda/src/compose';
import mapSources, { SourcesMapper } from './mapSources';
import mapSinksWithSources, { SinksWithSourcesMapper } from './mapSinksWithSources';
import { HigherOrderComponent } from './interfaces';

export interface MapSourcesAndSinks {
  ( sourceNames: string | string[],
    sourcesMapper: SourcesMapper,
    sinkNames: string | string[],
    sinksMapper: SinksWithSourcesMapper ): HigherOrderComponent;
}

const mapSourcesAndSinks: MapSourcesAndSinks =
  (sourceNames, sourcesMapper, sinkNames, sinksMapper) =>
    compose(
      mapSources(sourceNames, sourcesMapper),
      mapSinksWithSources(sinkNames, sourceNames, sinksMapper)
    );

export default mapSourcesAndSinks;
