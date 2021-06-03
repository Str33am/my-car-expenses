import React, { useState } from 'react';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import axios from 'axios';
import clsx from 'clsx';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { FormControl, InputAdornment, InputLabel, OutlinedInput, Button, Dialog } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { updateMyCar, updateUserStore } from '../store/actions/actions';
import { useDispatch } from 'react-redux';
import { Auth } from 'aws-amplify';
import { snackbar } from './shared/helpers';
import config from '../config.json';

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
}

const LogIn:React.FC<LogInProps> = props => {
  const {open, setOpen} = props;
  const classes = useLocalStyles();
  const dispatch = useDispatch();
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState<boolean>(false);

  const [errorMessage, setErrorMessage ] = useState<string>('');
  const [username, setUsername ] = useState<string>('');
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false,
  });

  const fetchUser = async () => {
    const userInfo = await Auth.currentUserInfo();
    const {username} = userInfo
    const {email} = userInfo.attributes;
    
    const responseUser = await axios.get(config.api.invokeURL + `/user/${email}`)
    .catch(err => {
      dispatch(updateUserStore({email, username}));
      axios.put(config.api.invokeURL + `/user`, { email: email, username: username})
          .catch(err => {
              setErrorMessage(err)
              setOpenErrorSnackbar(true);
          })
    });
    
    if (responseUser && responseUser.data) {
      dispatch(updateUserStore(responseUser.data));
      if (responseUser.data.car) {
        dispatch(updateMyCar(responseUser.data.car));
      }
    }
    
}

  const login = async () => {

    try {
      await Auth.signIn( username, values.password);
      
      await fetchUser();
      setOpenSuccessSnackbar(true);
      setOpen(false);
    } catch (error) {
      setErrorMessage(!error.message ? error : error.message);
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

  const handleOnClose = () => {
    setOpen(false);
    setErrorMessage('');
  }


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <Dialog onClose={handleOnClose} aria-labelledby="customized-dialog-title" open={open} fullWidth>
        <DialogTitle id="customized-dialog-title" onClose={handleOnClose}>
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
        {/* <Link href={"/"} style={{"marginLeft": 10}}>Reset your password here.</Link> */}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => login()} color="primary">
            Log In
          </Button>
        </DialogActions>
      </Dialog>
      {snackbar(2500, setOpenSuccessSnackbar, openSuccessSnackbar, `Welcome ${username}`, 'success')}
      {snackbar(5000, setOpenErrorSnackbar, openErrorSnackbar, `ERROR: ${errorMessage}`, 'error')}
    </div>
  );
};

export default LogIn;