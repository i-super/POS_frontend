import { BehaviorSubject } from "rxjs";

let count = 0;

const _requestInProgress = new BehaviorSubject(false);

const requestInProgress = _requestInProgress.asObservable();

const clear = () => {
  count = 0;
  _requestInProgress.next(false);
};

const start = () => {
  count++;
  _requestInProgress.next(true);
};

const stop = () => {
  count--;

  if (count < 0) {
    count = 0;
  }

  if (count === 0) {
    _requestInProgress.next(false);
  }
};

const spinnerSvc = {
  clear,
  requestInProgress,
  start,
  stop,
};

export default spinnerSvc;
