import { Link, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from '../styles/styles';

const Footer: React.FC<{}> = () => {
    const classes = useStyles();
    return (
        <div className={classes.footerContainer}>
            <Typography className={classes.footerText}>Aplication Created By <Link href='https://www.linkedin.com/in/bogdan-mihoci-729561188/'>Bogdan Mihoci</Link></Typography>
        </div>
    )
};

export default Footer;