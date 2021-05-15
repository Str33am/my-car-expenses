import { AppBar, Button, createStyles, Dialog, Grid, IconButton, makeStyles, Slide, Theme, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import Select from 'react-select';
import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import { selectDropdownStyle } from '../../styles/styles';
import { v4 as uuidv4 } from 'uuid';
import { Car, CarData, FUELTYPE, OptionType } from '../../types';
import { updateCars } from '../../store/actions/actions';
import { useDispatch } from 'react-redux';

import carsData from '../../cars.json';
import { generateMockExpenses } from '../shared/helpers';

interface AddCarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    carsToCompareState?: CarData[];
    setOpenSuccessSnackbar: React.Dispatch<React.SetStateAction<boolean>>;

}

const AddCar: React.FC<AddCarProps> = props => {
    const classes = useStyles();
    const { open, setOpen, carsToCompareState, setOpenSuccessSnackbar } = props;
    const dispatch = useDispatch();
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [year, setYear] = useState<number>(0);
    const [fuelType, setFuelType] = useState<FUELTYPE>();

    const makes: OptionType[] = useMemo(() => {
        const cars: Car[] = _.uniqBy(carsData, "make");
        return cars.map(c => ({ value: c.make, label: c.make }))
    }, []);

    const years: OptionType[] = useMemo(() => {
        const carsByYear = carsData.filter(cd => cd.make === make);

        return _.uniqBy(carsByYear, "year").map((c: any) => ({ value: c.year, label: c.year })).reverse()
    }, [make]);

    const models: OptionType[] = useMemo(() => {
        const carsByMake = carsData.filter(cd => cd.make === make && cd.year === year);

        return carsByMake.map(c => ({ value: c.model, label: c.model }))
    }, [year, make]);

    const fuelTypes: OptionType[] = useMemo(() => {
        return [{ value: FUELTYPE.DIESEL, label: FUELTYPE.DIESEL }, { value: FUELTYPE.PETROL, label: FUELTYPE.PETROL }, { value: FUELTYPE.ELECTRIC, label: FUELTYPE.ELECTRIC }, { value: FUELTYPE.HYBRID, label: FUELTYPE.HYBRID }]
    }, [])


    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        const cars = carsToCompareState ? [...carsToCompareState] : [];
        const car: CarData = {
            id: uuidv4(),
            car: {
                make: make,
                model: model,
                year: year
            },
            fuelType: fuelType ?? FUELTYPE.DIESEL,
            mileage: Math.floor(Math.random() * 100000),
            mileageTolerance: 0,
            milesTolerance: 0,
            yearTolerance: 0,
            expenses: {
                fuelExpenses: [],
                serviceExpenses: [],
                maintenanceExpenses: [],
                roadTaxExpenses: [],
            },
        };
        const carWithMockExpenses = generateMockExpenses(car);
        cars.push(carWithMockExpenses)
        dispatch(updateCars(cars));
        setOpen(false);
        setOpenSuccessSnackbar(true);
    };

    const handleChange = (data: any, setOption: (value: any) => void) => {
        if (data) setOption(data.value);
    }

    const selectedMake = makes.find(m => m.value === make);

    const selectedModel = models.find(m => m.value === model);

    const selectedYear = years.find(y => y.value === year);

    const selectedFuelTypes = fuelTypes.find(m => m.value === fuelType);

    const isValid = make !== "" && model !== "" && year !== 0 && fuelType

    return (
        <div>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Add Vehicle
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleAdd} disabled={!isValid}>
                            Add
                        </Button>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={1} className={classes.mainContainer}>
                    <Grid item xs={12} className={classes.selectContainer}>
                        <Typography variant="h6" >Make</Typography>
                        <Select
                            options={makes}
                            defaultValue={selectedMake}
                            value={selectedMake}
                            components={{
                                IndicatorSeparator: () => null,
                            }}
                            styles={selectDropdownStyle}
                            onChange={(data: any) => {
                                handleChange(data, setMake);
                                setYear(0);
                                setModel('');
                            }}
                        />
                        {
                            make !== "" &&
                            <>
                                <Typography variant="h6" >Year</Typography>
                                <Select
                                    options={years}
                                    defaultValue={selectedYear}
                                    value={selectedYear}
                                    components={{
                                        IndicatorSeparator: () => null,
                                    }}
                                    styles={selectDropdownStyle}
                                    onChange={(data: any) => {
                                        handleChange(data, setYear);
                                        setModel('')
                                    }}
                                />
                            </>
                        }
                        {
                            make !== "" && year !== 0 &&
                            <>
                                <Typography variant="h6" >Model</Typography>
                                <Select
                                    options={models}
                                    defaultValue={selectedModel}
                                    value={selectedModel}
                                    components={{
                                        IndicatorSeparator: () => null,
                                    }}
                                    styles={selectDropdownStyle}
                                    onChange={(data: any) => handleChange(data, setModel)}
                                />
                            </>
                        }
                        {
                            make !== "" && year !== 0 && model !== "" &&
                            <>
                                <Typography variant="h6" >Fuel Type</Typography>
                                <Select
                                    options={fuelTypes}
                                    defaultValue={selectedFuelTypes}
                                    value={selectedFuelTypes}
                                    components={{
                                        IndicatorSeparator: () => null,
                                    }}
                                    styles={selectDropdownStyle}
                                    onChange={(data: any) => handleChange(data, setFuelType)}
                                />
                            </>
                        }
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    );
};

export default AddCar;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
            color: "black",
            backgroundColor: "#ffffff",
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        toolbar: {
            backgroundColor: "#ffffff",
            width: "95%",
        },
        mainContainer: {
            width: '33%',
            backgroundColor: '#F5F5F5',
            display: 'grid',
            marginLeft: '33%',
            marginTop: "10%",

        },
        selectContainer: {
            marginLeft: '22%',
            marginTop: 10,
            marginBottom: 10,
        }
    }),
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
