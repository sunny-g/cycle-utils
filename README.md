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
import mapSources from '@sunny-g/cycle-utils/dist/es2015/mapSources';
```

## api

A **higher-order component** (HOC) is a function that takes in a Cycle.js component and returns a Cycle.js component.

This pattern makes HOCs composable and allows us to use [Ramda](http://ramdajs.com/)'s [`compose`](http://ramdajs.com/docs/#compose) or [`pipe`](http://ramdajs.com/docs/#pipe) functions to stitch multiple HOCs together into a single, larger HOC.

The following HOCs and utilities are provided by this library:

* Higher-order components:
  * [`mapSources`](#mapsources)
  * [`mapSinks`](#mapsinks)
  * [`mapSourcesAndSinks`](#mapsourcesandsinks)
  * [`mapSinksWithSources`](#mapsinkswithsources)
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

HOC that applies the `sourceMapper` to `sources` *before* they've been passed into the `BaseComponent`

##### parameters:
* `sourceNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want to pass the entire `sources` object)
* `sourceMapper: (Sources | ...Sources[]) => Sources`: Transform function to be applied to specified `sources`

Example:

```js
blah();
```

### `mapSinks()`
```
mapSinks(
  sinkNames,
  sinkMapper
): HigherOrderComponent
```
HOC that applies the `sinkMapper` to `sinks` *after* they've been returned from the `BaseComponent`

##### parameters:
* `sinkNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want to pass the entire `sinks` object)
* `sinkMapper: (Sinks | ...Sinks[]) => Sinks`: Transform function to be applied to specified `sinks`

Example:

```js
blah();
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
HOC to transform both a component's `sources` *before* entering the `BaseComponent` and a component's `sinks`*after* they've been returned from the `BaseComponent`

##### parameters:
* `sourceNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want the entire `sources` object)
* `sourceMapper: (Sources | ...Sources[]) => Sources`: Transform function to be applied to specified `sources`
* `sinkNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want the entire `sinks` object)
* `sinkMapper: (Sinks | ...Sinks[]) => Sinks`: Transform function to be applied to specified `sinks`

Example:

```js
blah();
```

### `mapSinksWithSources()`
```
mapSourcesAndSink(
  sinkNames,
  sourceNames,
  sinkAndSourceMapper
): HigherOrderComponent
```
HOC to transform a component's `sinks` with any desired `sources` *after* the `sinks` have been returned from the `BaseComponent`

##### parameters:
* `sinkNames: '*' | string | string[]`: Sinks you want to transform (`'*'` if you want the entire `sinks` object)
* `sourceNames: '*' | string | string[]`: Sources you want to transform (`'*'` if you want the entire `sources` object)
* `sinkAndSourceMapper: (Sinks | ...Sinks[], Sources | ...Sources[]) => Sinks`: Transform function to be applied to specified `sinks` and `sources`

Example:

```js
blah();
```

### `combineSinks(combiners): SinksCombiner`
Utility to declaratively combine multiple `Sinks` objects

##### parameters:
* `combiners: { [sinkName: string]: sinkCombiner }`: Object of `sinkCombiner`s
  * each individual `sinkCombiner` has the signature `(...sinks) => sink` and is given each `Sink` from each passed-in `Sinks` object (`undefined` if it doesn't exist) and should return a combined `Sink` stream

##### returns:
* `SinksCombiner: (...Sinks[]) => Sinks`: A function to apply to multiple `Sink` objects that:
  1. groups all `Sinks` of the same `sinkName` into an array
  2. applies each individual `sinkCombiner` to the destructured array of the `Sinks`
  3. creates and returns a new `Sinks` object from the combined `Sink`s.

Example:

```js
blah();
```

### `combineCycles(combiners): CycleComponentFactory`
Utility to declaratively combine multiple Cycle components into a single Cycle component

##### parameters:
* `combiners: { [sinkName: string]: sinkCombiner }`: Object of `sinkCombiner`s
  * each individual `sinkCombiner` has the signature `(...sinks) => sink` and is given each `Sink` from each passed-in `Sinks` object (`undefined` if it doesn't exist) and should return a combined `Sink` stream

##### returns:
* `CycleComponentFactory: (...CycleComponents[]) => CombinedCycleComponent`: Uses the `combiners` to create a `CombinedCycleComponent`
  * `CombinedCycleComponent: (Sources | ...Sources[]) => Sinks`: An otherwise normal Cycle.js component that takes in either:
     * a single `Sources` object to be passed into each original `CycleComponent`
     * an array of `Sources` objects to be passed into the original `CycleComponent` by index

Example:

```js
blah();
```


## contributing

#### todo

- ensure typings are comprehensive and correct
- explain contribution process
- add more tests :)
- explain why I wrote this

## license
ISC
