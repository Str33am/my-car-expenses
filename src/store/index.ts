import { createStore } from 'redux';
import createReducer from './reducers';

const store = createStore(createReducer(null));

export default store;
