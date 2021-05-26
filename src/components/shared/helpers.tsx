import { CarData, OptionType } from "../../types";
import { v4 as uuidv4 } from 'uuid';
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';

export const getYearOptions = (): OptionType[] => {
    const yearsList: number[] = [];
    const year = new Date().getFullYear();
    for (let i = 1900; i <= year; i++) {
        yearsList.push(i);
    }
    yearsList.reverse();
    return yearsList.map(y => ({ value: y, label: y }))
};

export const getFormattedDate = (date: Date): string => {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return month + '/' + day + '/' + year;
}

export const generateMockExpenses = (car: CarData): CarData => {
        const now = new Date()
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDay())
        const randomDate = (start: any, end: any): Date => {
            var date = new Date(+start + Math.random() * (end - start));
            return date;
        };
        const randomExpense = () => {
            return {
                id: uuidv4(),
                cost: Number((Math.random() * 50).toFixed(2)),
                date: randomDate(lastYear, now),
                mileage: car.mileage + Number((Math.random() * 1000).toFixed(2)),
            }
        }
        const randomFuelExpense = () => {
            return {
                id: uuidv4(),
                date: randomDate(lastYear, now),
                costPerUnit: Number((Math.random() * 2).toFixed(2)),
                quantity: Number((Math.random() * 80 + 20).toFixed(0)),
                mileage: car.mileage + Number((Math.random() * 1000).toFixed(2)),
            }
        }

        const carCopy = { ...car };
        for (let index = 0; index < 6; index++) {
            carCopy.expenses.serviceExpenses.push(randomExpense());
            carCopy.expenses.maintenanceExpenses.push(randomExpense());
            carCopy.expenses.roadTaxExpenses.push(randomExpense());
            carCopy.expenses.fuelExpenses.push(randomFuelExpense());
        }
        return carCopy;
};

export function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const snackbar = (duration: number, setOpenSnackbar: (t: boolean) => void, openSnackbar: boolean, message: string, type: Color)  => {
return (
    <Snackbar
        autoHideDuration={duration}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        key={uuidv4()}
    >
      <Alert onClose={() => setOpenSnackbar(false)} severity={type}>
        {message}
      </Alert>
    </Snackbar>
)
}