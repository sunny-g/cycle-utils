export type Sources = {
  [name: string]: any;
}

export type Sinks = {
  [name: string]: any;
}

export type Component = {
  (sources: Sources): Sinks;
}

export interface HigherOrderComponent {
  (BaseComponent: Component): Component;
}

export interface HigherOrderComponentFactory {
  (...args: any[]): HigherOrderComponent;
}
