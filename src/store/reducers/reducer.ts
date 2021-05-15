import { AppState, User, CarData } from '../../types';
import * as Actions from '../actions/actions';

const initialState: AppState = {
  user: {} as User,
  myCar: {} as CarData,
  carsToCompareState: [] as CarData[],
  filters: {
    fuel: true,
    maintenance: true,
    service: true,
    tax: true
  },
  expensesFilter: 'fuel',
  myFilters: {
    fuel: true,
    maintenance: true,
    service: true,
    tax: true
  }
}

const sosellReducer = (state: AppState = initialState, action: Actions.Actions) => {

  switch (action.type) {
    case Actions.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case Actions.UPDATE_FILTERS:
      return {
        ...state,
        filters: action.payload.filter,
      };
    case Actions.UPDATE_MY_CAR:
      return {
        ...state,
        myCar: action.payload.myCar,
      };
    case Actions.UPDATE_CARS:
      return {
        ...state,
        carsToCompareState: action.payload.cars,
      };
    case Actions.UPDATE_EXPENSE_FILTERS:
      return {
        ...state,
        expensesFilter: action.payload.filter,
      };
    case Actions.UPDATE_MY_FILTERS:
      return {
        ...state,
        myFilters: action.payload.filter,
      };
    case Actions.CLEAR_ALL:
      return initialState;
    default:
      return state;
  }
};

export default sosellReducer;
