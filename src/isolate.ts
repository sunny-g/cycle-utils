import cycleIsolate from '@cycle/isolate';
import { HigherOrderComponent } from './interfaces';

export interface Isolate {
  (config: ((sources: any) => null | string | {}) | null | string | {}): HigherOrderComponent;
}

const isolate: Isolate = config => BaseComponent => sources =>
  config === undefined ?
    cycleIsolate(BaseComponent)(sources) : typeof config === 'function' ?
    cycleIsolate(BaseComponent, config(sources))(sources) :
    cycleIsolate(BaseComponent, config)(sources);

export default isolate;
