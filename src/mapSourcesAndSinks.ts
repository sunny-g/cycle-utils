import compose from 'ramda/src/compose';
import mapSources, { SourcesMapper } from './mapSources';
import mapSinksWithSources, { SinksWithSourcesMapper } from './mapSinksWithSources';
import { HigherOrderComponent } from './types';

export interface MapSourcesAndSinks<T> {
  ( sourceNames: string | string[],
    sourcesMapper: SourcesMapper<T>,
    sinkNames: string | string[],
    sinksMapper: SinksWithSourcesMapper<T> ): HigherOrderComponent<T>;
}

const mapSourcesAndSinks: MapSourcesAndSinks<any> =
  (sourceNames, sourcesMapper, sinkNames, sinksMapper) =>
    compose(
      mapSources(sourceNames, sourcesMapper),
      mapSinksWithSources(sinkNames, sourceNames, sinksMapper)
    );

export default mapSourcesAndSinks;
