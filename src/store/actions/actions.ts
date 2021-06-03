import { action } from 'typesafe-actions'; 
import { ActionType } from "typesafe-actions";
import { CarData, IFilters } from '../../types';

export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_MY_CAR = "UPDATE_MY_CAR";
export const UPDATE_MY_FILTERS = "UPDATE_MY_FILTERS";
export const UPDATE_FILTERS = "UPDATE_FILTERS";
export const UPDATE_EXPENSE_FILTERS = "UPDATE_EXPENSE_FILTERS";
export const UPDATE_CARS = "UPDATE_CARS";
export const CLEAR_ALL = "CLEAR_ALL";

/* Actions */ 

export const updateUserStore = (user: any) => { 
    return action(UPDATE_USER, {user} );
}

export const updateMyCar = (myCar: CarData) => { 
    return action(UPDATE_MY_CAR, {myCar} );
}

export const updateCars = (cars: CarData[]) => { 
    return action(UPDATE_CARS, {cars} );
}

export const updateFilters = (filter: IFilters) => { 
    return action(UPDATE_FILTERS, {filter} );
}

export const updateMyFilters = (filter: IFilters) => { 
    return action(UPDATE_MY_FILTERS, {filter} );
}

export const updateExpenseFilters = (filter: string) => { 
    return action(UPDATE_EXPENSE_FILTERS, {filter} );
}

export const clearAll = () => { 
    return action(CLEAR_ALL);
}

const actions = { updateUserStore, updateFilters, updateMyFilters, updateExpenseFilters, updateMyCar, updateCars, clearAll } 
      
export type Actions = ActionType<typeof actions>