import { makeStyles, createStyles, useTheme } from '@material-ui/core/styles';

const defaultFont = {
    fontFamily: [
        'ApercuPro', 'Arial', 'Helvetica', 'sans-serif'
    ].join(',')
};

const useStyles = makeStyles(() =>
    createStyles({
        wrapper: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            backgroundColor: '#FAFAFA'
        },
        logoContainer: {
            flexBasis: "100%",
            textAlign: 'center',
            margin: "15px 0 15px 0",

        },
        image: {
            justifyContent: 'center',
            height: 350,
        },
        body: {
            flexBasis: "100%",
            fontSize: '60px',
            defaultFont,
            textAlign: 'center',
            color: "#232227"
        },
    }),
);

const NotFound = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
        <div className={classes.wrapper}>
                    <br />
                    <span className={classes.body}>404 - Page Not Found</span>
                    <br />
                    <div className={classes.logoContainer}>
                        <img
                            className={classes.image}
                            src="https://agent3-platform-cdn.s3-eu-west-1.amazonaws.com/signposts.png"
                            alt="open-door"
                        />
                    </div>
                </div>

    );
};

export default NotFound;