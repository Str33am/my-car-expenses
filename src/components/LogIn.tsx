import React, { useState } from 'react';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { FormControl, InputAdornment, InputLabel, Link, OutlinedInput, Snackbar } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { updateUserStore } from '../store/actions/actions';
import { useDispatch } from 'react-redux';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from 'aws-amplify';
import { Alert } from './shared/helpers';
import useStyles from '../styles/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
    textField: {
      width: '55ch',
    },
  }),
);

interface State {
  password: string;
  showPassword: boolean;
}


interface LogInProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user?: User;
}

const LogIn:React.FC<LogInProps> = props => {
  const {open, setOpen, user} = props;
  const classes = useLocalStyles();
  const dispatch = useDispatch();
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);
  const [cognitoError, setCognitoError] = useState<string>('');
  const globalClasses = useStyles();

  const [username, setUsername ] = useState<string>('');
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false,
  });

  const login = async () => {

    try {
      await Auth.signIn({
        username: username,
        password: values.password,
      });
      
      setOpenSuccessSnackbar(true);
      dispatch(updateUserStore({...user, username}));
      setOpen(false);
    } catch (error) {
      setCognitoError(!error.message ? error : error.message);
    }

  };

  const handlePasswordChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, password: event.target.value });
  };
  
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  
  const handleUsernameChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <Dialog onClose={() => setOpen(false)} aria-labelledby="customized-dialog-title" open={open} fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={() => setOpen(false)}>
          Log In
        </DialogTitle>
        <DialogContent dividers>
        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth >
          <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
          <OutlinedInput
            id="outlined-adornment-username"
            type={'text'}
            value={username}
            onChange={handleUsernameChange()}
            labelWidth={70}
            error={username === ''}
          />
        </FormControl>
          <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" fullWidth >
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handlePasswordChange()}
            error={values.password === ''}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
        <Link href={"https://www.google.com"} style={{"marginLeft": 10}}>Reset your password here.</Link>
        {cognitoError !== '' ? <span className={globalClasses.errorText}>{cognitoError}</span> : null}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => login()} color="primary">
            Log In
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        autoHideDuration={2500}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={openSuccessSnackbar}
        onClose={() => setOpenSuccessSnackbar(false)}
        key={uuidv4()}
        >
        <Alert onClose={() => setOpenSuccessSnackbar(false)} severity="success">
            {`Welcome ${username}`}
        </Alert>
        </Snackbar>
    </div>
  );
};

export default LogIn;