import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { timer } from 'rxjs/observable/timer';
import { mergeMap, finalize } from 'rxjs/operators';

export const genericRetryStrategy = (
  {
    maxRetryAttempts = 10,
    scalingDuration = 1000 * 120,
    excludedStatusCodes = []
  }: {
    maxRetryAttempts?: number;
    scalingDuration?: number;
    excludedStatusCodes?: string[];
  } = {}
) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return _throw(error);
      }
      // console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
      console.log(`Attempt ${retryAttempt}: retrying in ${ scalingDuration}ms`);
      // retry after 1s, 2s, etc...
      // return timer(retryAttempt * scalingDuration);
      return timer(scalingDuration);
    }),
    finalize(() => console.log('We are done!'))
  );
};
