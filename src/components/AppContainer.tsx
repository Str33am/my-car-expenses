import { Avatar, Button, Grid, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import LogIn from './LogIn';
import useStyles from '../styles/styles';
import SignUp from './SignUp';
import { IRootState } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll, updateUserStore } from '../store/actions/actions';
import Footer from './Footer';
import { Auth } from 'aws-amplify';

const AppContainer: React.FC<{}> = (props) => {

    const classes = useStyles();
    const localClasses = useLocalStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const userSelector = (state: IRootState) => state.app.appState.user;
    const user = useSelector(userSelector);

    const myCarSelector = (state: IRootState) => state.app.appState.myCar
    const myCar = useSelector(myCarSelector);

    const [navValue, setNavValue] = React.useState<number>(0);
    const [openLoginDialog, setOpenLoginDialog] = React.useState<boolean>(false);
    const [openSignUpDialog, setOpenSignUpDialog] = React.useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setNavValue(newValue);
    };

    useEffect(() => {
        try {
            
            Auth.currentAuthenticatedUser().then((resp: {username: string}) => {
                const username = resp.username
                dispatch(updateUserStore({...user, username}));
            });
            

        } catch (error) {
            console.warn(error);
            
        }
    //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (navValue === 0) {
            history.push('/');
        } else if (navValue === 1) {
            history.push('/cars');
        } else if (navValue === 2) {
            history.push('/expenses');
        }
    }, [navValue, history]);

    const logOut = () => {
        dispatch(clearAll());
        Auth.signOut();
    };

    return (
        <div className={classes.main}>
            <Grid container spacing={3} className={classes.navBar}>
                <Grid item xs={3}>
                    <Grid container spacing={1} >
                        <Grid item xs={1} sm={1}>
                            <Avatar className={classes.avatar} src="https://car-expenses-bucket.s3-eu-west-1.amazonaws.com/logo.PNG" />
                        </Grid>
                        <Grid item xs={11} sm={11}>
                            <Typography className={classes.appName}>My Car Expense</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={7} className={localClasses.navigation}>
                    {
                        user?.username &&
                        <Tabs
                            className={localClasses.tabsRoot}
                            value={navValue}
                            TabIndicatorProps={{ style: { display: "none" } }}
                            textColor="primary"
                            onChange={handleChange}
                        >
                            <Tab className={localClasses.tabRoot} label="My Car" />
                            <Tab className={localClasses.tabRoot} label="Cars" disabled={myCar?.car === undefined} />
                            <Tab className={localClasses.tabRoot} label="Expenses" disabled={myCar?.car === undefined} />
                        </Tabs>
                    }
                </Grid>
                {
                    user?.username ?
                        <Grid item xs={2} className={classes.navigation}>
                            <Button className={classes.navBotton} onClick={() => { }} >{user.username}</Button>
                            <Button className={classes.navBotton} onClick={() => logOut()} >Log Out</Button>
                        </Grid> :
                        <Grid item xs={2} className={classes.navigation}>
                            <Button className={classes.navBotton} onClick={() => setOpenLoginDialog(true)} >Log In</Button>
                            <Button className={classes.navBotton} onClick={() => setOpenSignUpDialog(true)} >Sign Up</Button>
                        </Grid>
                }
            </Grid>
            <Grid container spacing={3}>
                {
                    user?.username && props.children
                }
            </Grid>
            <Footer />
            <LogIn open={openLoginDialog} user={user} setOpen={setOpenLoginDialog} />
            <SignUp open={openSignUpDialog} user={user} setOpen={setOpenSignUpDialog} setOpenLoginDialog={setOpenLoginDialog}/>
        </div >
    );
};

export default AppContainer;

const tabHeight = '24px' // default: '48px'
const useLocalStyles = makeStyles(theme => ({
    tabsRoot: {
        minHeight: tabHeight,
        height: tabHeight,
    },
    tabRoot: {
        minHeight: tabHeight,
        height: tabHeight

    },
    navigation: {
        alignItems: 'center',
        display: 'flex',
        backgroundColor: '#83B3AB',
        justifyContent: 'flex-start',
    },
}));