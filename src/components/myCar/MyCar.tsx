import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, createStyles, FormControl, FormControlLabel, FormGroup, Grid, InputAdornment, InputLabel, makeStyles, OutlinedInput, Snackbar, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MainContainer from '../shared/MainContainer';
import { Car, CarChartData, CarData, FUELTYPE, IRootState, Months, OptionType } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from '../../styles/styles';
import { updateMyCar, updateMyFilters } from '../../store/actions/actions';
import clsx from 'clsx';
import _ from 'lodash';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Alert, generateMockExpenses } from '../shared/helpers';

import carsData from '../../cars.json';

const MyCar: React.FC<{}> = () => {
    const globalClasses = useStyles();
    const localClasses = useLocalStyles();
    const dispatch = useDispatch();

    const selectMyCar = (state: IRootState) => state.app.appState.myCar;
    const myCar = useSelector(selectMyCar);

    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [carYear, setCarYear] = useState<number>(0);
    const [mileage, setMileage] = useState<number | undefined>(myCar?.mileage);
    const [fuelType, setFuelType] = useState<FUELTYPE>();
    const [mileageTolerance, setMileageTolerance] = useState<number | undefined>(myCar?.mileageTolerance);
    const [milesTolerance, setMilesTolerance] = useState<number | undefined>(myCar?.milesTolerance);
    const [yearTolerance, setYearTolerance] = useState<number | undefined>(myCar?.yearTolerance);

    const [year, setYear] = useState<number>(new Date().getFullYear());

    const selectFilter = (state: IRootState) => state.app.appState.myFilters;
    const filters = useSelector(selectFilter);

    const myMake = myCar?.car?.make ? myCar.car.make : make;
    const myModel = myCar?.car?.model ? myCar.car.model : model;
    const myYear = myCar?.car?.year ? myCar.car.year : carYear;
    const myFuelType = myCar?.fuelType ?? fuelType;

    const { fuel, maintenance, service, tax } = filters;

    const makes: OptionType[] = _.uniqBy(carsData, "make").map((c: Car) => ({ value: c.make, label: c.make }));

    const years: OptionType[] = _.uniqBy(carsData.filter(cd => cd.make === myMake), "year").map((c: any) => ({ value: c.year, label: c.year })).reverse();

    const models: OptionType[] = carsData.filter(cd => cd.make === myMake && cd.year === myYear).map(c => ({ value: c.model, label: c.model }));

    const fuelTypes: OptionType[] = [
        { value: FUELTYPE.DIESEL, label: FUELTYPE.DIESEL },
        { value: FUELTYPE.PETROL, label: FUELTYPE.PETROL },
        { value: FUELTYPE.ELECTRIC, label: FUELTYPE.ELECTRIC },
        { value: FUELTYPE.HYBRID, label: FUELTYPE.HYBRID }];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateMyFilters({ ...filters, [event.target.name]: event.target.checked }));
    };

    const handleMileageChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') setMileage(undefined);
        if (Number(event.target.value) > 0) setMileage(Number(event.target.value));
    };

    const handleMileageToleranceChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') setMileageTolerance(undefined);
        if (Number(event.target.value) > 0) setMileageTolerance(Number(event.target.value));
    };

    const handleMilesToleranceChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') setMilesTolerance(undefined);
        if (Number(event.target.value) > 0) setMilesTolerance(Number(event.target.value));
    };

    const handleYearToleranceChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') setYearTolerance(undefined);
        if (Number(event.target.value) > 0) setYearTolerance(Number(event.target.value));
    };

    const handleMakeChange = (data: { label: string, value: string }) => {
        if (myCar) setMake(data.value);
    };
    const handleYearChange = (data: { label: number, value: number }) => {
        if (myCar) setCarYear(data.value);
    }

    const handleModelChange = (data: { label: string, value: string }) => {
        if (myCar) setModel(data.value);
    };
    const handleFuelChange = (data: { label: FUELTYPE, value: FUELTYPE }) => {
        if (myCar) setFuelType(data.value);
    };

    const selectedYear = years.find(y => y.value === myYear);
    const selectedMake = makes.find(m => m.value === myMake);

    const selectedModel = models.find(m => m.value === myModel);

    const selectedFuelTypes = fuelTypes.find(m => m.value === myFuelType);

    const isValid = myMake !== "" && myModel !== "" && myYear !== 0 && myFuelType !== undefined

    const handleSave = () => {
        if (isValid) {
            let mc: CarData;
            if (!myCar?.car) {

                mc = {
                    id: uuidv4(),
                    car: {
                        make: myMake,
                        model: myModel,
                        year: myYear
                    },
                    fuelType: myFuelType ?? FUELTYPE.DIESEL,
                    mileage: mileage ? mileage : myCar?.mileage ?? 0,
                    mileageTolerance: mileageTolerance ?? 0,
                    yearTolerance: yearTolerance ?? 0,
                    milesTolerance: milesTolerance ?? 0,
                    expenses: {
                        fuelExpenses: [],
                        serviceExpenses: [],
                        maintenanceExpenses: [],
                        roadTaxExpenses: [],
                    },

                }

            } else {
                mc = { ...myCar };
                mc.car.make = myMake;
                mc.car.model = myModel;
                mc.car.year = myYear;
                mc.mileage = mileage ? mileage : myCar?.mileage ?? 0;
                mc.fuelType = myFuelType ?? FUELTYPE.DIESEL;
                mc.mileageTolerance = mileageTolerance ?? 0;
                mc.yearTolerance = yearTolerance ?? 0;
                mc.milesTolerance = milesTolerance ?? 0;
            }
            const carWithMockExpenses = generateMockExpenses(mc);
            dispatch(updateMyCar(carWithMockExpenses));
            setOpenSuccessSnackbar(true);
        }
    };

    const filterYears = (): OptionType[] => {
        const options: OptionType[] = []
        if (myCar?.expenses) {
            const years = [
                ...myCar.expenses.fuelExpenses.map(f => f.date.getFullYear()),
                ...myCar.expenses.maintenanceExpenses.map(m => m.date.getFullYear()),
                ...myCar.expenses.roadTaxExpenses.map(r => r.date.getFullYear()),
                ...myCar.expenses.serviceExpenses.map(s => s.date.getFullYear()),
            ]
            _.uniqBy(years).forEach((y: string) => options.push({ label: y, value: y }))
        }
        return options;
    };

    const selectedFilteredYear = filterYears().find(y => y.value === year);

    const SidePanel = (
        <div >
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
                                control={<Checkbox checked={fuel} onChange={handleChange} color="default" size="small" name="fuel" />}
                                label="Fuel"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={service} onChange={handleChange} color="default" size="small" name="service" />}
                                label="Service"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={maintenance} onChange={handleChange} color="default" size="small" name="maintenance" />}
                                label="Maintenance"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={tax} onChange={handleChange} color="default" size="small" name="tax" />}
                                label="Road Tax"
                            />
                        </FormGroup>
                        <br />
                        <Typography className={globalClasses.accordionHeading} >Year</Typography>
                        <Select
                            options={filterYears()}
                            defaultValue={selectedFilteredYear}
                            value={selectedFilteredYear}
                            components={{
                                IndicatorSeparator: () => null,
                            }}
                            styles={selectDropdownDateStyle}
                            onChange={(data: { label: number, value: number }) => setYear(data.value)}
                        />
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </div>
    );

    const expensesData = (): CarChartData[] => {
        const cars: CarChartData[] = [];
        type ExpenseType = { date: Date, cost: number, month: string };
        const monthlyFuelExpenses: ExpenseType[] = myCar?.expenses?.fuelExpenses.filter(ex => ex.date.getFullYear() === year).map(f => ({ date: f.date, cost: f.costPerUnit * f.quantity, month: Months[f.date.getMonth()] })) ?? [];
        const monthlyServiceExpenses: ExpenseType[] = myCar?.expenses?.serviceExpenses.filter(ex => ex.date.getFullYear() === year).map(f => ({ date: f.date, cost: f.cost, month: Months[f.date.getMonth()] })) ?? [];
        const monthlyMaintenanceExpenses: ExpenseType[] = myCar?.expenses?.maintenanceExpenses.filter(ex => ex.date.getFullYear() === year).map(f => ({ date: f.date, cost: f.cost, month: Months[f.date.getMonth()] })) ?? [];
        const monthlyRoadTaxExpenses: ExpenseType[] = myCar?.expenses?.roadTaxExpenses.filter(ex => ex.date.getFullYear() === year).map(f => ({ date: f.date, cost: f.cost, month: Months[f.date.getMonth()] })) ?? [];


        Months.forEach(month => {
            let fuelCost = 0;
            let serviceCost = 0;
            let maintenanceCost = 0;
            let roadTaxCost = 0;
            monthlyFuelExpenses.filter(mfe => mfe.month === month).forEach(f => fuelCost += f.cost);
            monthlyServiceExpenses.filter(mse => mse.month === month).forEach(f => serviceCost += f.cost);
            monthlyMaintenanceExpenses.filter(mme => mme.month === month).forEach(f => maintenanceCost += f.cost);
            monthlyRoadTaxExpenses.filter(mrte => mrte.month === month).forEach(f => roadTaxCost += f.cost);
            cars.push({
                Name: month,
                Fuel: Number(fuelCost.toFixed(2)),
                Service: Number(serviceCost.toFixed(2)),
                Maintenance: Number(maintenanceCost.toFixed(2)),
                'Road Tax': Number(roadTaxCost.toFixed(2)),
            });
        })

        return cars;
    }

    const MainPanel = (
        <div>
            <Grid container spacing={1} className={localClasses.mainContainer}>
                <Grid item xs={12} className={localClasses.selectContainer}>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Typography >Make</Typography>
                            <Select
                                options={makes}
                                defaultValue={selectedMake}
                                value={selectedMake}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                                styles={selectDropdownDateStyle}
                                onChange={(data: { label: string, value: string }) => handleMakeChange(data)}
                            />

                        </Grid>
                        <Grid item xs={2}>
                            <Typography >Year</Typography>
                            <Select
                                isDisabled={myMake === ""}
                                options={years}
                                defaultValue={selectedYear}
                                value={selectedYear}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                                styles={selectDropdownDateStyle}
                                onChange={(data: { label: number, value: number }) => handleYearChange(data)}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl className={clsx(globalClasses.margin, localClasses.textFieldContainer)} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-mileage">Mileage</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-Mileage"
                                    type={'number'}
                                    value={mileage}
                                    required
                                    endAdornment={<InputAdornment position="end">{mileage && mileage > 0 ? ' miles' : ''}</InputAdornment>}
                                    onChange={handleMileageChange()}
                                    labelWidth={70}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl className={clsx(globalClasses.margin, localClasses.textFieldContainer)} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-mileage-tolerance">Mileage Tolerance</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-mileage-tolerance"
                                    type={'number'}
                                    value={mileageTolerance}
                                    required
                                    startAdornment={<InputAdornment position="start">+/-</InputAdornment>}
                                    onChange={handleMileageToleranceChange()}
                                    labelWidth={130}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2}>
                            <Button autoFocus color="inherit" onClick={handleSave} disabled={!isValid}>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Typography >Model</Typography>
                            <Select
                                isDisabled={myMake === "" || myYear === 0}
                                options={models}
                                defaultValue={selectedModel}
                                value={selectedModel}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                                styles={selectDropdownDateStyle}
                                onChange={(data: { label: string, value: string }) => handleModelChange(data)}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Typography >Fuel</Typography>
                            <Select
                                isDisabled={myMake === "" || myYear === 0 || myModel === ""}
                                options={fuelTypes}
                                defaultValue={selectedFuelTypes}
                                value={selectedFuelTypes}
                                components={{
                                    IndicatorSeparator: () => null,
                                }}
                                styles={selectDropdownDateStyle}
                                onChange={(data: { label: FUELTYPE, value: FUELTYPE }) => handleFuelChange(data)}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl className={clsx(globalClasses.margin, localClasses.textFieldContainer)} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-miles-tolerance">Miles Tolerance</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-miles-tolerance"
                                    type={'number'}
                                    value={milesTolerance}
                                    required
                                    startAdornment={<InputAdornment position="start">+/-</InputAdornment>}
                                    onChange={handleMilesToleranceChange()}
                                    labelWidth={120}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                            <FormControl className={clsx(globalClasses.margin, localClasses.textFieldContainer)} variant="outlined" >
                                <InputLabel htmlFor="outlined-adornment-year-tolerance">Year Tolerance</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-year-tolerance"
                                    type={'number'}
                                    value={yearTolerance}
                                    required
                                    startAdornment={<InputAdornment position="start">+/-</InputAdornment>}
                                    onChange={handleYearToleranceChange()}
                                    labelWidth={120}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                    {
                        myCar?.car &&
                        <>
                            <br />
                            <br />
                            <Grid item xs={12}>
                                Expenses £
                            </Grid>
                        </>
                    }
                </Grid>
            </Grid>
            {myCar?.car &&
                <Grid container spacing={1} className={localClasses.mainContainer}>
                    <ResponsiveContainer width='100%' height={300}>
                        <BarChart
                            width={100}
                            height={300}
                            data={expensesData()}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}

                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Name" />
                            <YAxis tickFormatter={(value: number) => `£${value}`}/>
                            <Tooltip />
                            <Legend />
                            {filters.tax && <Bar barSize={40} dataKey="RoadTax" stackId="a" fill="#1368CE" unit="£"/>}
                            {filters.maintenance && <Bar barSize={40} dataKey="Maintenance" stackId="a" fill="#E23C4F" unit="£"/>}
                            {filters.service && <Bar barSize={40} dataKey="Service" stackId="a" fill="#8492A6" unit="£"/>}
                            {filters.fuel && <Bar barSize={40} dataKey="Fuel" stackId="a" fill="#80C15C" unit="£"/>}
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>
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
    );


    return (
        <MainContainer sideComponent={myCar?.car && SidePanel} mainComponent={MainPanel} />
    )
};

export default MyCar;


const useLocalStyles = makeStyles(() =>
    createStyles({
        mainContainer: {
            display: 'grid',

        },
        selectContainer: {
            margin: 10,
        },
        textFieldContainer: {
            minWidth: 150,
        }
    }),
);

const selectDropdownDateStyle = {
    control: (styles: any) => ({
        ...styles,
        backgroundColor: 'white',
        fontSize: 'medium',
        width: '150',
        cursor: 'pointer',
        color: 'black',
        marginBottom: 15,
        marginLeft: 10,
        boxShadow: '0px 0px #888888',
        '&:hover': {
            borderColor: 'black',
        },
    }),
    option: (styles: any, { isDisabled, isSelected }: any) => {
        return {
            ...styles,
            color: isSelected ? 'black' : 'black',
            backgroundColor: isSelected ? 'white' : 'white',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
        };
    },
    menu: (styles: any) => ({
        ...styles,
        marginLeft: 10,
        width: '150',
        marginTop: '0',
        borderRadius: '0',
        borderTop: '0',
    }),

};
