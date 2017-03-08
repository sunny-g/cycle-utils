import compose from 'ramda/src/compose';
import { HigherOrderComponent } from './types';

/**
 * Applies prop-related HOCs right-to-left, because props flow outside-in
 */

export interface ComposePropsHOC<Stream> {
  (...hocs: HigherOrderComponent<Stream>[]): HigherOrderComponent<Stream>;
}

const composePropHOCs: ComposePropsHOC<any> = (...hocs) => compose(...hocs);

export default composePropHOCs;
