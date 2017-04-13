import combineSinks, { Combiners } from './combineSinks';
import { Component } from './interfaces';

export interface CombineCycles {
  (combiners: Combiners): Component;
}

/**
 * a task begins with component sources
 * for each task
 *   - apply it to the current sources
 *   - return a single sink or array of sinks for each key in the set of sink keys
 */
const combineCycles = (combiners = {}) => (...components) => {
  const sinkCombiner = combineSinks(combiners);

  return function CompositeComponent(...sources) {
    const sinks = components.map((component, index) =>
      sources.length > 1
        ? component(sources[index])
        : component(sources)
    );

    return sinkCombiner(...sinks);
  };
}

export default combineCycles;
