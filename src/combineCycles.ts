import combineSinks, { Combiners } from './combineSinks';
import { head } from './util';
import { Sources, Sinks, Component } from './interfaces';

export interface ICompositeComponent {
  (...sources: Sources[]): Sinks;
}

export interface CombineCycles {
  ( combiners: Combiners,
    ...BaseComponents: Component[],
  ): ICompositeComponent;
}

/**
 * a task begins with component sources
 * for each task
 *   - apply it to the current sources
 *   - return a single sink or array of sinks for each key in the set of sink keys
 */
const combineCycles: CombineCycles = (combiners = {}, ...BaseComponents) => {
  const sinkCombiner = combineSinks(combiners);

  return function CompositeComponent(...sources) {
    const sinks = BaseComponents.map((BaseComponent, index) =>
      sources.length > 1
        ? BaseComponent(sources[index])
        : BaseComponent(head(sources))
    );

    return sinkCombiner(...sinks);
  };
}

export default combineCycles;
