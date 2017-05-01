import { isPlainObject, pluckSinks } from './util';
import { HigherOrderComponent } from './interfaces';

export interface SinksMapper {
  (...sinks: any[]): { [sinkName: string]: any };
}

export interface MapSinks {
  ( sinkNames: string | string[],
    mapper: SinksMapper ): HigherOrderComponent;
}

const mapSinks: MapSinks = (sinkNames, mapper) =>
  BaseComponent =>
    sources => {
      const sinks = BaseComponent(sources);
      const sinksOfInterest = pluckSinks(sinkNames, sinks);
      const newSinks = mapper(...sinksOfInterest);

      if (!isPlainObject(newSinks)) {
        throw new Error('Sinks mapper must return a plain object');
      }

      return {
        ...sinks,
        ...newSinks,
      };
    };

export default mapSinks;
