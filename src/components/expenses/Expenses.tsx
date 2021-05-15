import { Accordion, AccordionDetails, AccordionSummary, Button, createStyles, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, InputLabel, makeStyles, OutlinedInput, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import React, { useState } from 'react';
import useStyles from '../../styles/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CarData, FUELTYPE, IFuelExpense, IMaintenanceExpense, IRoadTaxExpense, IRootState, IServiceExpense, Order } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { updateExpenseFilters, updateMyCar } from '../../store/actions/actions';
import MainContainer from '../shared/MainContainer';
import TableSortedHeader from '../shared/TableSortedHeader';
import { get, sortBy, lowerCase } from 'lodash';
import { getFormattedDate } from '../shared/helpers';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import { v4 as uuidv4 } from 'uuid';

const Expenses: React.FC<{}> = () => {
    const globalClasses = useStyles();
    const selectMyCar = (state: IRootState) => state.app.appState.myCar;
    const myCar = useSelector(selectMyCar);

    const selectFilter = (state: IRootState) => state.app.appState.expensesFilter;
    const filter = useSelector(selectFilter);
    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateExpenseFilters((event.target as HTMLInputElement).value));
    };

    const onDelete = (id: string) => {
        if (myCar) {            
            if (filter === 'service') {
                dispatch(updateMyCar({ ...myCar, expenses: { ...myCar.expenses, serviceExpenses: [...myCar.expenses.serviceExpenses].filter(f => f.id !== id) } }));
            } else if (filter === 'maintenance') {
                dispatch(updateMyCar({ ...myCar, expenses: { ...myCar.expenses, maintenanceExpenses: [...myCar.expenses.maintenanceExpenses].filter(f => f.id !== id) } }));
            } else if (filter === 'roadTax') {
                dispatch(updateMyCar({ ...myCar, expenses: { ...myCar.expenses, roadTaxExpenses: [...myCar.expenses.roadTaxExpenses].filter(f => f.id !== id) } }));
            }

        }
    }

    const onSave = (expense: IServiceExpense | IMaintenanceExpense | IRoadTaxExpense): void => {
        if (myCar) {
            const myCarCopy = { ...myCar };
            if (filter === 'service') {
                myCarCopy.expenses.serviceExpenses.push(expense)
            }
            if (filter === 'maintenance') {
                myCarCopy.expenses.maintenanceExpenses.push(expense)
            }
            if (filter === 'roadTax') {
                myCarCopy.expenses.roadTaxExpenses.push(expense)
            }
            dispatch(updateMyCar(myCarCopy));
        }
    };

    const SidePanel = (
        <div >
            <Accordion expanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    Expenses
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl component="fieldset" className={globalClasses.checkboxContainer}>
                        <FormGroup>
                            <RadioGroup aria-label="expenses" name="gender1" value={filter} onChange={handleChange}>
                                <FormControlLabel value="fuel" control={<Radio color="default" size='small' />} label="Fuel" />
                                <FormControlLabel value="service" control={<Radio color="default" size='small' />} label="Service" />
                                <FormControlLabel value="maintenance" control={<Radio color="default" size='small' />} label="Maintenance" />
                                <FormControlLabel value="roadTax" control={<Radio color="default" size='small' />} label="Road Tax" />
                            </RadioGroup>
                        </FormGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </div>
    );

    const renderMainPanel: JSX.Element = filter === 'fuel' ? <FuelExpensesPanel /> :
        <ServiceAndMaintenanceExpensesPanel
            onSave={onSave}
            onDelete={onDelete}
            myCar={myCar}
            expenseFilter={filter} />;

    return (
        <MainContainer
            sideComponent={SidePanel}
            mainComponent={renderMainPanel} />
    )
};

export default Expenses;

interface ServiceAndMaintenanceExpensesProps {
    onSave: (expense: IServiceExpense | IMaintenanceExpense) => void;
    onDelete: (id: string) => void;
    myCar?: CarData;
    expenseFilter: string;
}

const ServiceAndMaintenanceExpensesPanel: React.FC<ServiceAndMaintenanceExpensesProps> = (props) => {
    const { onDelete, onSave, myCar, expenseFilter } = props;

    const localClasses = useLocalStyles();
    const globalClasses = useStyles();
    let expenses: Array<IServiceExpense | IMaintenanceExpense> | undefined = myCar?.expenses?.serviceExpenses;
    if (expenseFilter === 'maintenance') expenses = myCar?.expenses?.maintenanceExpenses
    if (expenseFilter === 'roadTax') expenses = myCar?.expenses?.roadTaxExpenses

    const [mileage, setMileage] = useState<number>(myCar?.mileage ?? 0);
    const [cost, setCost] = useState<number>();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('date');

    const sortedList = orderSerManinExpBy(expenses, order, orderBy);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleMileageChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) === 0) setMileage(Number(event.target.value));
        if (Number(event.target.value) > 0) setMileage(Number(event.target.value));
    };

    const handleCostChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) > 0) setCost(Number(event.target.value));
        if (Number(event.target.value) === 0) setCost(undefined);
    };

    const handleSave = () => {
        onSave({
            id: uuidv4(),
            cost: cost ?? 0,
            date: new Date(),
            mileage: mileage ?? 0,
        });
    };

    const headCells = [
        { id: 'date', numeric: false, disablePadding: false, label: 'Data' },
        { id: 'mileage', numeric: false, disablePadding: false, label: 'Mileage' },
        { id: 'cost', numeric: false, disablePadding: false, label: `Cost` },
    ];

    const expensesTotal = (expenses: Array<IServiceExpense | IMaintenanceExpense> | undefined): string => {
        let total = 0;
        if (expenses) expenses.forEach(exp => total += exp.cost);
        return `£${total.toFixed(2)}`;
    }

    return (

        <div>
            <Grid container spacing={1} className={localClasses.mainContainer}>
                <Grid item xs={12} className={localClasses.selectContainer}>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <FormControl className={globalClasses.margin} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-mileage">Mileage</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-Mileage"
                                    type={'number'}
                                    value={mileage}
                                    required
                                    endAdornment={<InputAdornment position="end">{mileage > 0 ? ' miles' : ''}</InputAdornment>}
                                    onChange={handleMileageChange()}
                                    labelWidth={70}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl className={globalClasses.margin} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-cost">Cost</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-cost"
                                    type={'number'}
                                    value={cost}
                                    required
                                    startAdornment={<InputAdornment position="start">£</InputAdornment>}
                                    onChange={handleCostChange()}
                                    labelWidth={60}
                                    error={cost !== undefined && cost < 0}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} className={localClasses.buttonContainer}>
                            <Button autoFocus color="inherit" onClick={handleSave} disabled={cost === undefined || cost === 0}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={localClasses.tableContainer}>
                    <TableContainer component={Paper}>
                        <Table aria-label="table">
                            <TableSortedHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} headCells={headCells} deleteRowCell />
                            <TableBody>
                                {sortedList?.length ? sortedList.map((item: IServiceExpense | IMaintenanceExpense, index: number) => (
                                    <TableRow key={`tablelisting-${index}`}>
                                        <TableCell align="left" className={localClasses.deleteCell}>
                                            <Button onClick={() => onDelete(item.id)}><DeleteForeverOutlinedIcon color='action' fontSize='small' />
                                            </Button>
                                        </TableCell>
                                        <TableCell align="left" >{getFormattedDate(get(item, 'date', ''))}</TableCell>
                                        <TableCell align="justify">{item.mileage.toFixed(0)}</TableCell>
                                        <TableCell align="justify">{`£${item.cost}`}</TableCell>
                                    </TableRow>
                                )) : null}
                                {sortedList?.length ? <TableRow>
                                    <TableCell colSpan={2} />
                                    <TableCell >Total</TableCell>
                                    <TableCell align="left">{expensesTotal(sortedList)}</TableCell>
                                </TableRow> : null}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
};

const FuelExpensesPanel: React.FC = () => {
    const localClasses = useLocalStyles();
    const globalClasses = useStyles();
    const dispatch = useDispatch();

    const selectMyCar = (state: IRootState) => state.app.appState.myCar;
    const myCar = useSelector(selectMyCar);

    const [mileage, setMileage] = useState<number>(myCar?.mileage ?? 0);
    const [costPerUnit, setCostPerUnit] = useState<number>();
    const [quantity, setQuantity] = useState<number>();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<string>('date');

    const sortedList = orderFuelExpBy(myCar?.expenses?.fuelExpenses, order, orderBy);

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleMileageChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) === 0) setMileage(Number(event.target.value));
        if (Number(event.target.value) > 0) setMileage(Number(event.target.value));
    };

    const handleCostPerUnitChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) > 0) setCostPerUnit(Number(event.target.value));
        if (Number(event.target.value) === 0) setCostPerUnit(undefined);
    };
    const handleQuantityChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) === 0) setQuantity(undefined);
        if (Number(event.target.value) > 0) setQuantity(Number(event.target.value));
    };

    const handleSave = () => {
        if (myCar?.expenses) {
            const myCarCopy = { ...myCar };
            myCarCopy.expenses.fuelExpenses.push(
                {
                    id: uuidv4(),
                    costPerUnit: costPerUnit ?? 0,
                    date: new Date(),
                    quantity: quantity ?? 0,
                    mileage: mileage ?? 0,
                }
            )

            dispatch(updateMyCar(myCarCopy));
        }
    };

    const onDelete = (id: string) => {
        if (myCar) {
            dispatch(updateMyCar({ ...myCar, expenses: { ...myCar.expenses, fuelExpenses: [...myCar.expenses.fuelExpenses].filter(f => f.id !== id) } }));
        }
    }

    const fuelExpensesTotal = (expenses: Array<IFuelExpense> | undefined): string => {
        let total = 0;
        if (expenses) expenses.forEach(exp => total += exp.costPerUnit * exp.quantity);
        return total.toFixed(2);
    }

    const headCells = [
        { id: 'date', numeric: false, disablePadding: false, label: 'Data' },
        { id: 'mileage', numeric: true, disablePadding: true, label: 'Mileage' },
        { id: 'costPerUnit', numeric: true, disablePadding: true, label: `Cost Per Unit` },
        { id: 'quantity', numeric: true, disablePadding: true, label: `Quantity${myCar?.fuelType === FUELTYPE.ELECTRIC ? ' (kWh)' : ' (l)'}` },
    ];

    return (

        <div>
            <Grid container spacing={1} className={localClasses.mainContainer}>
                <Grid item xs={12} className={localClasses.selectContainer}>
                    <Grid container spacing={1}>
                        <Grid item xs={3}>
                            <FormControl className={globalClasses.margin} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-mileage">Mileage</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-Mileage"
                                    type={'number'}
                                    value={mileage}
                                    required
                                    endAdornment={<InputAdornment position="end">{mileage > 0 ? ' miles' : ''}</InputAdornment>}
                                    onChange={handleMileageChange()}
                                    labelWidth={70}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl className={globalClasses.margin} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-cost">Cost Per Unit</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-cost"
                                    type={'number'}
                                    value={costPerUnit}
                                    required
                                    startAdornment={<InputAdornment position="start">£</InputAdornment>}
                                    onChange={handleCostPerUnitChange()}
                                    labelWidth={110}
                                    error={costPerUnit !== undefined && costPerUnit < 0}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl className={globalClasses.margin} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-qty">Quantity</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-qty"
                                    type={'number'}
                                    value={quantity}
                                    endAdornment={<InputAdornment position="end">{myCar?.fuelType === FUELTYPE.ELECTRIC ? ' kWh' : ' l'}</InputAdornment>}
                                    required
                                    onChange={handleQuantityChange()}
                                    labelWidth={80}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} >
                            <Button className={localClasses.buttonContainer} autoFocus color="inherit" onClick={handleSave} disabled={costPerUnit === undefined || costPerUnit === 0 || quantity === undefined || quantity === 0}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className={localClasses.tableContainer}>
                    <TableContainer component={Paper}>
                        <Table aria-label="table">
                            <TableSortedHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} headCells={headCells} deleteRowCell totalCell='Cost' />
                            <TableBody>
                                {sortedList?.length ? sortedList.map((item: IFuelExpense, index: number) => (
                                    <TableRow key={`tablelisting-${index}`}>
                                        <TableCell align="left" className={localClasses.deleteCell}>
                                            <Button onClick={() => onDelete(item.id)}><DeleteForeverOutlinedIcon color='action' fontSize='small' />
                                            </Button>
                                        </TableCell>
                                        <TableCell align="left" >{getFormattedDate(get(item, 'date', ''))}</TableCell>
                                        <TableCell align="justify">{get(item, 'mileage', 0).toFixed(0)}</TableCell>
                                        <TableCell align="justify">{`£${(get(item, 'costPerUnit', 0))}`}</TableCell>
                                        <TableCell align="justify">{get(item, 'quantity', 0)}</TableCell>
                                        <TableCell align="right">{`£${(get(item, 'costPerUnit', 0) * (get(item, 'quantity', 0))).toFixed(2)}`
                                        }
                                        </TableCell>
                                    </TableRow>
                                )) : null}
                                {sortedList?.length ? <TableRow>
                                    <TableCell colSpan={4} />
                                    <TableCell colSpan={1}>Total</TableCell>
                                    <TableCell align="right">{`£${fuelExpensesTotal(sortedList)}`}</TableCell>
                                </TableRow> : null}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    );
};

const orderSerManinExpBy = (items: Array<IServiceExpense | IMaintenanceExpense> | undefined, order: Order, orderBy: string) => {
    if (items?.length) {
        const sortedList = sortBy(items, (item: IServiceExpense | IMaintenanceExpense) => {
            return typeof get(item, orderBy) === 'string' ? lowerCase(get(item, orderBy)) : get(item, orderBy);
        });
        return order === 'asc' ? sortedList : sortedList.reverse();
    }
    return items;
};

const orderFuelExpBy = (items: Array<IFuelExpense> | undefined, order: Order, orderBy: string): IFuelExpense[] | undefined => {
    if (items?.length) {
        const sortedList = sortBy(items, (item: IFuelExpense) => {

            if (orderBy === 'total') {

                return (item.costPerUnit * item.quantity).toFixed(2);
            }
            return typeof get(item, orderBy) === 'string' ? lowerCase(get(item, orderBy)) : get(item, orderBy);
        });


        return order === 'asc' ? sortedList : sortedList.reverse();
    }
    return items;
};

const useLocalStyles = makeStyles(() =>
    createStyles({
        mainContainer: {
            display: 'grid',

        },
        selectContainer: {
            margin: 10,
        },
        buttonContainer: {
            flex: 1,
            alignContent: 'center',
            justifyContent: 'right'
        },
        deleteCell: {
            width: 30,
        },
        tableContainer: {
            marginRight: 15
        }
    }),
);
