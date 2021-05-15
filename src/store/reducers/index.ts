import { combineReducers } from 'redux';
import { AppState } from '../../types';
import appState from './reducer';

const app = combineReducers({
  appState,
});

export type RootState = {
  app: {
    appState: AppState;
  };
};

const createReducer = (asyncReducers: any) =>
  combineReducers({
    app,
    ...asyncReducers,
  });

export default createReducer;
