import pipe from 'ramda/src/pipe';
import { HigherOrderComponent } from './types';

/**
 * Applies action-related HOCs left-to-right, because actions flow inside-out
 */

export interface PipeActionHOC<Stream> {
  (...hocs: HigherOrderComponent<Stream>[]): HigherOrderComponent<Stream>;
}

const pipeActionHOCs: PipeActionHOC<any> = (...hocs) => pipe(...hocs);

export default pipeActionHOCs
