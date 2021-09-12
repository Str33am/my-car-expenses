import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, createStyles, FormControl, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Typography, Divider, TableContainer, Paper, Table, TableBody, TableRow, TableCell, Snackbar } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import React, { useMemo, useState } from 'react';
import { get, sortBy, lowerCase } from 'lodash';
import useStyles, { selectDropdownDateStyle } from '../../styles/styles';
import MainContainer from '../shared/MainContainer';
import Select from 'react-select';
import AddCar from './AddCar';
import TableSortedHeader, { HeadCell } from '../shared/TableSortedHeader';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Order, Months, CarData, OptionType, IRootState, CarChartData } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { updateCars, updateFilters } from '../../store/actions/actions';
import { Alert, getYearOptions } from '../shared/helpers';
import { v4 as uuidv4 } from 'uuid';

const Cars: React.FC<{}> = () => {
    const globalClasses = useStyles();
    const localClasses = useLocalStyles();
    const dispatch = useDispatch();
    const [openAddCarDialog, setOpenAddCarDialog] = React.useState<boolean>(false);

    const selectFilter = (state: IRootState) => state.app.appState.filters;
    const filters = useSelector(selectFilter);

    const selectCarsFilter = (state: IRootState) => state.app.appState.carsToCompareState;
    const carsToCompareState = useSelector(selectCarsFilter);

    const selectMyCar = (state: IRootState) => state.app.appState.myCar;
    const myCar = useSelector(selectMyCar);

    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);

    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');
    const [toMonth, setToMonth] = useState<string>(Months[new Date().getMonth()]);
    const [toYear, setToYear] = useState<number>(new Date().getFullYear());
    const [fromMonth, setFromMonth] = useState<string>(Months[new Date().getMonth()]);
    const [fromYear, setFromYear] = useState<number>(new Date().getFullYear() - 1);

    const { fuel, maintenance, service, tax } = filters;

    const from = fromYear && fromMonth ? new Date(fromYear, Months.indexOf(fromMonth), new Date().getDate()) : new Date();
    const to = toYear && toMonth ? new Date(toYear, Months.indexOf(toMonth), new Date().getDate(), 23, 59, 59) : new Date();
    const period: number = monthDiff(fromYear, toYear, fromMonth, toMonth);

    const sortedList = myCar && carsToCompareState ? orderArrayBy([myCar, ...carsToCompareState], order, orderBy, filters, period) : [];

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangeFilters = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateFilters({ ...filters, [event.target.name]: event.target.checked }));
    };

    const removeVehicle = (id: string) => {
        if (carsToCompareState) {
            const newCars = carsToCompareState.filter(c => c.id !== id);
            dispatch(updateCars(newCars));
            setOpenSuccessSnackbar(true);
        }
    }

    const years: OptionType[] = useMemo(() => {
        return getYearOptions();
    }, []);

    const months: OptionType[] = useMemo(() => {

        return Months.map(m => ({ value: m, label: m }))
    }, []);

    const selectedMonthFrom = months.find(m => m.value === fromMonth);

    const selectedMonthTo = months.find(m => m.value === toMonth);

    const selectedYearTo = years.find(y => y.value === toYear);

    const selectedYearFrom = years.find(y => y.value === fromYear);

    const SidePanel = (
        <div className={localClasses.sideComponent}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    Cars
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={1} >
                        <Grid item xs={12}><Typography className={globalClasses.accordionHeading} >From</Typography></Grid>
                        <Grid item xs={6}>
                            <Select
                                options={months}
                                defaultValue={selectedMonthFrom}
                                value={selectedMonthFrom}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                                styles={selectDropdownDateStyle}
                                onChange={(data: any) => setFromMonth(data.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Select
                                options={years}
                                defaultValue={selectedYearFrom}
                                value={selectedYearFrom}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                                styles={selectDropdownDateStyle}
                                onChange={(data: any) => setFromYear(data.value)}
                            />
                        </Grid>
                        <Grid item xs={12}><Typography className={globalClasses.accordionHeading} >To</Typography></Grid>
                        <Grid item xs={6}>
                            <Select
                                options={months}
                                defaultValue={selectedMonthTo}
                                value={selectedMonthTo}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                                styles={selectDropdownDateStyle}
                                onChange={(data: any) => setToMonth(data.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Select
                                options={years}
                                defaultValue={selectedYearTo}
                                value={selectedYearTo}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                                styles={selectDropdownDateStyle}
                                onChange={(data: any) => setToYear(data.value)}
                            />
                        </Grid>
                        <Grid item xs={12} >{' '}</Grid>
                        <Grid item xs={12}>
                            {
                                period > 0 ?
                                    <div className={localClasses.buttonContainer}>
                                        <Button
                                            variant="contained"
                                            autoFocus
                                            color="inherit"
                                            size="small"
                                            onClick={() => setOpenAddCarDialog(true)}
                                            className={globalClasses.button}
                                            startIcon={<AddIcon />}
                                        >
                                            Add Car
                                        </Button>
                                    </div> : <span className={globalClasses.errorText}>Please provide a valid period</span>
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <List className={localClasses.listContainer} dense>
                                {
                                    carsToCompareState && carsToCompareState.map((vehicle) => (
                                        myCar?.id !== vehicle.id &&
                                        <div key={vehicle.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={`${vehicle?.car?.make ?? ''} ${vehicle?.car?.model ?? ''}`}
                                                    secondary={`${vehicle?.car?.year ?? ''} ${vehicle?.fuelType ?? ''}`}
                                                />

                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete" onClick={() => removeVehicle(vehicle?.id)}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider variant="fullWidth" component="li" />
                                        </div>
                                    ))
                                }
                            </List>
                        </Grid>
                    </Grid>
                </AccordionDetails>
                <AddCar
                    open={openAddCarDialog}
                    setOpen={setOpenAddCarDialog}
                    carsToCompareState={carsToCompareState}
                    setOpenSuccessSnackbar={setOpenSuccessSnackbar}
                />
            </Accordion>
            <Accordion >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    Expenses Filters
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl component="fieldset" className={globalClasses.checkboxContainer}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={fuel} onChange={handleChangeFilters} color="default" size="small" name="fuel" />}
                                label="Fuel"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={service} onChange={handleChangeFilters} color="default" size="small" name="service" />}
                                label="Service"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={maintenance} onChange={handleChangeFilters} color="default" size="small" name="maintenance" />}
                                label="Maintenance"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={tax} onChange={handleChangeFilters} color="default" size="small" name="tax" />}
                                label="Road Tax"
                            />
                        </FormGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </div>
    )

    const headCells = (): HeadCell[] => {
        const hc = [
            { id: 'car.make', numeric: false, disablePadding: false, label: 'Make' },
            { id: 'car.model', numeric: true, disablePadding: true, label: 'Model' },
            { id: 'fuelType', numeric: true, disablePadding: true, label: 'Fuel Type' },
            { id: 'period', numeric: true, disablePadding: true, label: 'Period' },
            { id: 'miles', numeric: true, disablePadding: true, label: 'Miles' },
            { id: 'mileage', numeric: true, disablePadding: true, label: 'Mileage' },
        ];

        if (filters.fuel) hc.push({ id: 'fuelExpenses', numeric: true, disablePadding: true, label: 'Fuel' })
        if (filters.service) hc.push({ id: 'serviceExpenses', numeric: true, disablePadding: true, label: 'Service' })
        if (filters.maintenance) hc.push({ id: 'maintenanceExpenses', numeric: true, disablePadding: true, label: 'Maintenance' })
        if (filters.tax) hc.push({ id: 'roadTaxCost', numeric: true, disablePadding: true, label: 'Road Tax' })

        return hc;
    };

    const carData = () => {
        const cars: CarChartData[] = [];
        if (carsToCompareState && fromYear && fromMonth && toYear && toMonth && myCar) {
            const allCarsToCompare = [myCar, ...carsToCompareState];
            allCarsToCompare.forEach(c =>

                cars.push(
                    {
                        Name: myCar?.id === c.id ? `MY CAR` : `${c.car.make} ${c.car.model}`,
                        Fuel: Number(getFuelExpensesTotal(c, from, to).toFixed(2)),
                        Service: Number(getServiceExpensesTotal(c, from, to).toFixed(2)),
                        Maintenance: Number(getMaintenanceExpensesTotal(c, from, to).toFixed(2)),
                        'Road Tax': Number(getRoadTaxExpensesTotal(c, from, to).toFixed(2))
                    }));
        }
        return cars;
    }
    const MainPanel = (
        <div >
            {sortedList.length ?
                <Grid container spacing={1} >
                    <Grid item xs={12}>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart
                                width={100}
                                height={300}
                                data={carData()}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}

                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Name" />
                                <YAxis tickFormatter={(value: number) => `£${value}`} />
                                <Tooltip />
                                <Legend />
                                {filters.tax && <Bar barSize={40} dataKey="Road Tax" stackId="a" fill="#1368CE" />}
                                {filters.maintenance && <Bar barSize={40} dataKey="Maintenance" stackId="a" fill="#E23C4F" />}
                                {filters.service && <Bar barSize={40} dataKey="Service" stackId="a" fill="#8492A6" />}
                                {filters.fuel && <Bar barSize={40} dataKey="Fuel" stackId="a" fill="#80C15C" />}
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={12} >
                        <TableContainer component={Paper}>
                            <Table aria-label="table">
                                <TableSortedHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} headCells={headCells()} totalCell='Total' />
                                {
                                    period > 0 ?
                                        <TableBody>
                                            {sortedList.map((item: CarData) => (
                                                <TableRow key={`tablelisting-${item.id}`}>
                                                    <TableCell align="left" className={item?.id === myCar?.id ? localClasses.boldText : undefined} >{get(item, 'car.make', '')}</TableCell>
                                                    <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{get(item, 'car.model')}</TableCell>
                                                    <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{item.fuelType}</TableCell>
                                                    <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{period} months</TableCell>
                                                    <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{getMiles(item, from, to)}</TableCell>
                                                    <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{item.mileage}</TableCell>
                                                    {filters.fuel && <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{`£${getFuelExpensesTotal(item, from, to).toFixed(2)}`}</TableCell>}
                                                    {filters.service && <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{`£${getServiceExpensesTotal(item, from, to).toFixed(2)}`}</TableCell>}
                                                    {filters.maintenance && <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{`£${getMaintenanceExpensesTotal(item, from, to).toFixed(2)}`}</TableCell>}
                                                    {filters.tax && <TableCell align="justify" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>{`£${getRoadTaxExpensesTotal(item, from, to).toFixed(2)}`}</TableCell>}
                                                    <TableCell align="right" className={item?.id === myCar?.id ? localClasses.boldText : undefined}>
                                                        {
                                                            `£${((filters.fuel ? getFuelExpensesTotal(item, from, to) : 0) +
                                                             (filters.maintenance ? getMaintenanceExpensesTotal(item, from, to) : 0) +
                                                             (filters.service ? getServiceExpensesTotal(item, from, to) : 0) +
                                                             (filters.tax ? getRoadTaxExpensesTotal(item, from, to) : 0)).toFixed(2)}`
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody> : null}
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid> : null
            }
            <Snackbar

                autoHideDuration={2500}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={openSuccessSnackbar}
                onClose={() => setOpenSuccessSnackbar(false)}
                key={uuidv4()}

            >
                <Alert onClose={() => setOpenSuccessSnackbar(false)} severity="success">
                    Success!
                </Alert>
            </Snackbar>
        </div>
    )

    return (
        <MainContainer sideComponent={SidePanel} mainComponent={MainPanel} />
    )
};

export default Cars;

const useLocalStyles = makeStyles(() =>
    createStyles({
        buttonContainer: {
            width: '100%',
        },
        sideComponent: {

            overflow: 'auto',
            maxHeight: window.innerHeight - 150,
        },
        listContainer: {
            width: '100%',
            maxWidth: 360,
            position: 'relative',
            overflow: 'auto',
        },
        boldText: {
            fontWeight: 'bold',
        }
    }),
);

const orderArrayBy = (items: Array<CarData>, order: Order, orderBy: string, expensesState: any, period: number) => {
    if (items?.length) {
        const sortedList = sortBy(items, (item: any) => {

            if (orderBy === 'total' && period > 0) {

                return ((expensesState.fuel ? item.fuelExpenses * period : 0) +
                    (expensesState.maintenance ? item.maintenanceExpenses * period : 0) +
                    (expensesState.service ? item.serviceExpenses * period : 0) +
                    (expensesState.tax ? item.roadTaxCost * period : 0) * period).toFixed(2);
            }
            return typeof get(item, orderBy) === 'string' ? lowerCase(get(item, orderBy)) : get(item, orderBy);
        });


        return order === 'asc' ? sortedList : sortedList.reverse();
    }
    return items;
};

const monthDiff = (fromYear: any, toYear: any, fromMonth: any, toMonth: any): number => {
    if (!fromYear || !fromMonth || !toYear || !toMonth) { return 12 }

    const dateFrom = new Date(fromYear, Months.indexOf(fromMonth.value), 1);
    const dateTo = new Date(toYear, Months.indexOf(toMonth.value), 1);

    const period = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
    return period ? period : -1
};

const getMiles = (car: CarData, from: Date, to: Date): string => {
    
    const mileages: number[] = []
    car.expenses.fuelExpenses.filter(fe => fe.date > from && fe.date < to).forEach(f => mileages.push(f.mileage))
    car.expenses.roadTaxExpenses.filter(fe => fe.date > from && fe.date < to).forEach(f => mileages.push(f.mileage))
    car.expenses.serviceExpenses.filter(fe => fe.date > from && fe.date < to).forEach(f => mileages.push(f.mileage))
    car.expenses.maintenanceExpenses.filter(fe => fe.date > from && fe.date < to).forEach(f => mileages.push(f.mileage))
    return (Math.max(...mileages) - Math.min(...mileages)).toFixed(0);
};

const getFuelExpensesTotal = (car: CarData, from: Date, to: Date): number => {
    let fuelTotal = 0;
    car?.expenses?.fuelExpenses && car.expenses.fuelExpenses.filter(fe => fe.date > from && fe.date < to).forEach(f => fuelTotal += f.costPerUnit * f.quantity)
    return fuelTotal;
};

const getServiceExpensesTotal = (car: CarData, from: Date, to: Date): number => {
    let serviceTotal = 0;
    car?.expenses?.serviceExpenses.filter(fe => fe.date > from && fe.date < to).forEach(s => serviceTotal += s.cost)
    return serviceTotal;
};

const getMaintenanceExpensesTotal = (car: CarData, from: Date, to: Date): number => {
    let maintenanceTotal = 0;
    car?.expenses?.maintenanceExpenses.filter(fe => fe.date > from && fe.date < to).forEach(s => maintenanceTotal += s.cost)
    return maintenanceTotal;
};

const getRoadTaxExpensesTotal = (car: CarData, from: Date, to: Date): number => {
    let roadTaxTotal = 0;
    car?.expenses?.roadTaxExpenses.filter(fe => fe.date > from && fe.date < to).forEach(s => roadTaxTotal += s.cost)
    return roadTaxTotal;
};