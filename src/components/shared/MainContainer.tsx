import { createStyles, Grid, makeStyles } from '@material-ui/core';
import React from 'react';

interface MainContainerProps {
    sideComponent?: React.ReactElement;
    mainComponent: React.ReactElement;
}

const MainContainer: React.FC<MainContainerProps> = (props) => {
    const { sideComponent, mainComponent } = props;
    const localClasses = useLocalStyles();
    return (
        <Grid container spacing={3} className={localClasses.root}>
            <Grid item xs={3} className={localClasses.leftContainer}>
                {sideComponent}
            </Grid>
            <Grid item xs={9} className={localClasses.rightContainer}>
                {mainComponent}
            </Grid>
        </Grid>
    )
};

export default MainContainer;

const useLocalStyles = makeStyles(() =>
    createStyles({
        root: {
            overflow: 'auto',
            marginBottom: 10,
            marginTop: 5,
            marginLeft: 5,
            width: '100%',
            height: window.innerHeight - 90,
        },
        leftContainer: {
            backgroundColor: '#f9fafc',
            borderRight: '1px solid #e2e1e1',
        },
        rightContainer: {
            backgroundColor: '#f9fafc'
        }
    }),
);