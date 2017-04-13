import { pluckSinks } from './util';
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

      return {
        ...sinks,
        ...mapper(...sinksOfInterest),
      };
    };

export default mapSinks;
