import * as crypto from 'crypto';

// this usually takes a few seconds
export function work(limit = 100000) {
  let start = Date.now();
  let n = 0;
  while(n < limit) {
    crypto.randomBytes(2048);
    n++;
  }
  return {
    timeElapsed: Date.now() - start,
  };
}
 