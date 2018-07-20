# cycle-utils
*utilities and higher-order components for transforming Cycle components, sources and sinks*

## why

The popular utility library [Recompose](https://github.com/acdlite/recompose) allows you to write simple [React](https://facebook.github.io/react/) components and independently augment them with additional granular and testable layers of additional functionality.

This [library](https://github.com/sunny-g/cycle-utils) provides simple higher-order component factories and other utilities to simplify [Cycle.js](https://cycle.js.org/) components and allow you to write your own higher-order component libraries easily.

## installation
```
npm install --save @sunny-g/cycle-utils
```

## usage
```js
import { mapSources } from '@sunny-g/cycle-utils';
// or
import mapSources from '@sunny-g/cycle-utils/es2015/mapSources';
```

## api

A **higher-order component** (HOC) is a function that takes in a Cycle.js component and returns a Cycle.js component.

This pattern makes HOCs composable and allows us to use [Ramda](http://ramdajs.com/)'s [`compose`](http://ramdajs.com/docs/#compose) or [`pipe`](http://ramdajs.com/docs/#pipe) functions to stitch multiple HOCs together into a single, larger HOC.

The following HOCs and utilities are provided by this library:

* Higher-order components:
  * [`mapSources`](#mapsources)
  * [`mapSinks`](#mapsinks)
  * [`mapSinksWithSources`](#mapsinkswithsources)
  * [`mapSourcesAndSinks`](#mapsourcesandsinks)
  * [`isolate`](#isolate)
* Utilities:
  * [`combineSinks`](#combinesinks)
  * [`combineCycles`](#combinecycles)

### `mapSources()`
```
mapSources(
  sourceNames,
  sourceMapper
): HigherOrderComponent
```

HOC that applies the `sourceMapper` to `sources` *before* they've been passed into the `BaseComponent`.

##### parameters:
* `sourceNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want to pass the entire `sources` object)
* `sourceMapper: (Sources | ...Sources[]) => Sources`: Transform function to be applied to specified `sources`; the returned `Sources` are merged into the original `Sources`

Example:

```js
// adds a fetched property to the `props` object provided by a fictional `props` source
const withNewProps = mapSources(
  [ 'props', 'HTTP' ], (propsSource, HTTP) => {
    const newProp = HTTP
      .select('newProp')
      .flatten();

    const newPropsSource = combine(propsSource, newProp)
      .map(([ props, newProp ]) => ({
        ...props,
        'newProp': newProp,
      });

    return { props: newPropsSource };
  }
);

const ComponentWithProps = withNewProps(Component);
```

### `mapSinks()`
```
mapSinks(
  sinkNames,
  sinkMapper
): HigherOrderComponent
```

HOC that applies the `sinkMapper` to `sinks` *after* they've been returned from the `BaseComponent`.

##### parameters:
* `sinkNames: '*' | string | string[]`: Sinks you want to transform (`'*'` if you want to pass the entire `sinks` object)
* `sinkMapper: (Sinks | ...Sinks[]) => Sinks`: Transform function to be applied to specified `sinks`; the returned `Sinks` are merged into the original `Sinks`

Example:

```js
// logs all emitted HTTP requests
const logHTTPSink = mapSinks(
  'HTTP', (HTTPSink) => ({
    HTTP: HTTPSink.debug('making an HTTP request'),
  })
);

const ComponentWithLoggedHTTPSink = logHTTPSink(Component);
```

### `mapSinksWithSources()`
```
mapSourcesAndSink(
  sinkNames,
  sourceNames,
  sinkAndSourceMapper
): HigherOrderComponent
```

HOC to transform a component's `sinks` with any desired `sources` *after* the `sinks` have been returned from the `BaseComponent`.

##### parameters:
* `sinkNames: '*' | string | string[]`: Sinks you want to transform (`'*'` if you want the entire `sinks` object)
* `sourceNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want the entire `sources` object)
* `sinkAndSourceMapper: (Sinks | ...Sinks[], Sources | ...Sources[]) => Sinks`: Transform function to be applied to specified `sinks` and `sources`; the returned `Sinks` are merged into the original `Sinks`

Example:

```js
// logs all emitted sinks values with the current props
const logAllSinks = mapSinksWithSources(
  '*', 'props', (sinks, propsSource) => {
    return Object.keys(sinks)
      .reduce((newSinks, sinkName) => ({
        ...newSinks,
        [sinkName]: sinks[sinkName]
          .compose(sampleCombine(propsSource))
          .debug('new sink emission with current props')
      }), {});
  }
);

const ComponentWithLoggedSinksWithProps = logAllSinks(Component);
```

### `mapSourcesAndSinks()`
```
mapSourcesAndSink(
  sourceNames,
  sourceMapper,
  sinkNames,
  sinkMapper
): HigherOrderComponent
```

HOC to transform both a component's `sources` *before* entering the `BaseComponent` and a component's `sinks`*after* they've been returned from the `BaseComponent`.

Uses [`mapSources`](#mapsources) and [`mapSinksWithSources`](#mapsinkswithsources) under the hood, so the same requirements of those functions apply.

##### parameters:
* `sourceNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want the entire `sources` object)
* `sourceMapper: (Sources | ...Sources[]) => Sources`: Transform function to be applied to specified `sources`; the returned `Sources` are merged into the original `Sources`
* `sinkNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want the entire `sinks` object)
* `sinkMapper: (Sinks | ...Sinks[], Sources) => Sinks`: Transform function to be applied to specified `sinks` as well as the entire `sources` object; the returned `Sinks` are merged into the original `Sinks`

Example:

```js
// TODO: ADD AN EXAMPLE HERE
```

### `isolate()`
```
isolate(
  config: ((Sources: any) => null | string | {}) | null | string | {}
): HigherOrderComponent
```

HOC version of `@cycle/isolate`.

##### parameters:
* `config: ((Sources: any) => null | string | {}) | null | string | {}`: Either `null`, a `string`, or an `object`, or a function that is given `sources` and returns `null`, a `string`, or an `object`

Example:

```js
// any component wrapped with randomIsolation will receive a randomly-generated scope

const randomIsolation = isolate(() => Math.random().toString());

const NewComponent = randomIsolation(Component);
```

### `combineSinks()`
```
combineSinks(
  combiners: { [sinkName: string]: sinkCombiner }
): SinksCombiner
```

Utility to declaratively combine multiple `Sinks` objects

##### parameters:
* `combiners: { [sinkName: string]: sinkCombiner }`: Object of `sinkCombiner`s for each `sinkName` to combine
  * each individual `sinkCombiner` has the signature `(...sink) => sink` and is given each `Sink` from each passed-in `Sinks` object and should return a combined `Sink` stream
  * **NOTE:** if the `sinkCombiner` for a given `sinkName` is missing and there are multiple `sinks` of that `sinkName`, the `sink`'s native `merge` function is applied to the list of `sinks`

##### returns:
* `SinksCombiner: (...Sinks[]) => Sinks`: A function to apply to multiple `Sinks` objects that:
  1. groups all `Sink`s of the same `sinkName` into an array
  2. applies each individual `sinkCombiner` to the destructured array of the `Sink`s
  3. creates and returns a new `Sinks` object from the combined `Sink`s.

Example:

```js
// say we have multiple non-identical children component sinks
// as well as the component's own sinks...

// has only a DOM sink
const mainSinks = { DOM: ... };
// each has both DOM and HTTP sinks
const childOneSinks = childOne(sources);
const childTwoSinks = childTwo(sources);

const sinkCombiner = combineSinks({
  // some drivers only require a merge of their sinks
    // combineSinks merges by default, but is shown here
    // note that there is no placeholder argument for missing sinks (mainSinks has no HTTP sink)
  HTTP: (childOneHTTP, childTwoHTTP) => xs.merge(childOneHTTP, childTwoHTTP),

  // some sinks require custom merging/combining...
  DOM: (mainDOM$, childOneDOM$, childTwoDOM$) => xs
    .combine(mainDOM$, childOneDOM$, childTwoDOM$)
    .map(([ mainDOM, childOneDOM, childTwoDOM ]) =>
      div([
        mainDOM,
        div([
          childOneDOM,
          childTwoDOM,
        ])
      ])
    ),
});

return sinkCombiner(mainSinks, childOneSinks, childTwoSinks);
```

### `combineCycles()`
```
combineCycles(
  combiners: { [sinkName: string]: sinkCombiner },
  ...BaseComponents: Component[]
): CombinedComponent
```

Utility to declaratively combine multiple Cycle components into a single Cycle component

##### parameters:
* `combiners: { [sinkName: string]: sinkCombiner }`: Object of `sinkCombiner`s for each `sinkName` to combine
  * each individual `sinkCombiner` has the signature `(...sinks) => sink` and is given each `Sink` from each passed-in `Sinks` object and should return a combined `Sink` stream
  * **NOTE:** if the `sinkCombiner` for a given `sinkName` is missing and there are multiple `sinks` of that `sinkName`, the first `sink`'s native `merge` operator is applied to the list of `sinks`
* `...BaseComponents: Component[]`: The desired Cycle.js components to combine into a single component

##### returns:
* `CombinedComponent: (Sources | ...Sources[]) => Sinks`: An otherwise normal Cycle.js component that differs from traditional components in that it takes in **either**:
  * a single `Sources` object to be passed into each `BaseComponent`
  * an list of `Sources` objects, each one passed into the corresponding `BaseComponent` by index

Example:

```js
// assume the same `childOne` and `childTwo` components from the previous example

const ChildrenComponent = combineCycles({
  HTTP: (...httpSinks) => xs.merge(...httpSinks),
  DOM: (childOneDOM$, childTwoDOM$) => xs
    .combine(childOneDOM$, childTwoDOM$)
    .map(([ childOneDOM, childTwoDOM ]) =>
      div([
        childOneDOM,
        childTwoDOM,
      ])
    ),
}, childOne, childTwo);

const childrenSinks = ChildrenComponent(sources);
```

Another useful example is for chaining tasks together in a more linear format:

```js
// the first task, makes a request
const task1 = _ => ({
  HTTP: of({
    url: 'https://google.com',
    category: 'req1',
  }),
});

// the second task
// maps the response of the first task's request into the response sink of the second task
const task2 = ({ HTTP }) => ({
  HTTP: HTTP
    .select('req1')
    .flatten()
    .map(res1 => ({
      url: res1.url,
      category: 'req2'
    })),
});

function main(sources) {
  const Task = combineCycles({}, task1, task2);
  const taskSinks = Task(sources);

  // now, we can use the result of the tasks
  const taskRes = sources.HTTP
    .select('req2')
    .flatten();

  // ... the rest of the component, returns main sinks merged with taskSinks...
}
```

## contributing

#### todo

- ensure typings are comprehensive and correct
- explain contribution process
- add more tests :)
- explain why I wrote this

## license
ISC
