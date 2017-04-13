import head from 'ramda/src/head';
import tail from 'ramda/src/tail';
import { mapObj } from './util';

export type Combiners = {
  [sinkName: string]: (...sinks: any[]) => any;
}

export interface SinksCombiner {
  (...allComponentSinks: any[]): { [sinkName: string]: any }
}

export interface CombineSinks {
  (combiners: Combiners): SinksCombiner
}

const combineSinks: CombineSinks = (combiners) => {
  // applied to object of arrays of sink streams
  const combiner = mapObj((sinks, sinkName) =>
    (typeof combiners[sinkName] === 'function') ?
      combiners[sinkName](...sinks) : sinks.length > 1 ?
      head(sinks).merge(...tail(sinks)) :
      head(sinks)
  );

  return function sinkCombiner(...allComponentSinks) {
    // combines sinks into an single object, each key is an array of sink streams
    const groupedSinks = allComponentSinks
      .reduce((newSinks, componentSinks) => ({
        ...newSinks,
        ...mapObj((sink, sinkName) => {
          return newSinks.hasOwnProperty(sinkName)
            ? newSinks[sinkName].concat(sink)
            : [ sink ];
        })(componentSinks),
      }), {});

    // then apply the combiner to the groupedSinks
    return combiner(groupedSinks);
  };
};

export default combineSinks;
