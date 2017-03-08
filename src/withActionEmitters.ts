import { FSA } from 'flux-standard-action';
import { Stream } from 'most';
import { sync, SyncSubject } from 'most-subject';

import mapSourcesAndSinks from './mapSourcesAndSinks';
import { ActionStream, HOC, PropsStream } from './types';

export interface WithActionEmitters {
  (actionCreators: { [type: string]: (...args: any[]) => FSA<any, any> }): HOC<Stream<any>>;
}

/**
 * similar to mapDispatchToProps, but each function returns the actions to be emitted, instead of relying on dispatch to explictly emit them
 *
 * param is object of functions
 *  - each function, when invoked, will be called with current props, followed by any other passed args
 *  - each function should return an action (or arrays of actions); if return value is null or undefined, no action is emitted
 * object will be merged with props
 */
const withActionEmitters: WithActionEmitters = (actionCreators) => {
  const [ handlers, streams ] = Object.keys(actionCreators)
    .reduce((handlersAndStreams, name) => {
      const [ handlers, streams ] = handlersAndStreams;
      const dispatch: SyncSubject<any | any[]> = sync();
      const variadicDispatch = (e, ...args) => (args.length === 0) ?
        dispatch.next(e) :
        dispatch.next([ e, ...args ]);

      return [
        { ...handlers, [name]: variadicDispatch, },
        { ...streams, [name]: dispatch },
      ];
    }, [ {}, {} ]);

  return mapSourcesAndSinks(
    'props',
    (props$: PropsStream): { 'props': PropsStream } => ({
      props: props$
        .map(props => ({
          ...props,
          ...handlers,
        }))
    }),
    'actions',
    (actions$: ActionStream, props$: PropsStream): { 'actions': ActionStream } => ({
      actions: actions$
        .mergeArray(
          Object.keys(streams)
            .map(name => (streams[name]
              .withLatestFrom(props$, (val, props) => (
                Array.isArray(val) ?
                  actionCreators[name](props, ...val) :
                  actionCreators[name](props, val)
                )
              )
            ))
        ),
    }),
  );
};

export default withActionEmitters;
