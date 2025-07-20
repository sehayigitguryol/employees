import {store} from './ReduxProvider.js';

export const withRedux = (BaseClass) => {
  return class extends BaseClass {
    constructor() {
      super();
      this._reduxUnsubscribers = [];
    }

    subscribeToStore(selector) {
      const unsubscribe = store.subscribe(() => {
        selector(store.getState());
        this.requestUpdate();
      });

      this._reduxUnsubscribers.push(unsubscribe);
      return unsubscribe;
    }
    getState() {
      return store.getState();
    }
    dispatch(action) {
      return store.dispatch(action);
    }

    disconnectedCallback() {
      this._reduxUnsubscribers.forEach((unsubscribe) => unsubscribe());
      this._reduxUnsubscribers = [];
      super.disconnectedCallback();
    }
  };
};
