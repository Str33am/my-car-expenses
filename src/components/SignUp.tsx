import React, { useState } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Alert } from './shared/helpers';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { FormControl, InputAdornment, InputLabel, OutlinedInput, Snackbar } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import useStyles from '../styles/styles';
import { v4 as uuidv4 } from 'uuid';
import { Auth } from 'aws-amplify';
import { updateUserStore } from '../store/actions/actions';
import { useDispatch } from 'react-redux';
import { User } from '../types';

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

interface State {
  firstPassword: string;
  showFirstPassword: boolean;
  secondPassword: string;
  showSecondPassword: boolean;
}


interface SignUpProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  user?: User;
}

const SignUp: React.FC<SignUpProps> = props => {
  const { open, setOpen, setOpenLoginDialog, user} = props;
  const globalClasses = useStyles();
  const dispatch = useDispatch();
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean | undefined>(undefined);
  const [isUserNameValid, setIsUsernameValid] = useState<boolean | undefined>(undefined);
  const [is1PassValid, setIs1PassValid] = useState<boolean | undefined>(undefined);
  const [is2PassValid, setIs2PassValid] = useState<boolean | undefined>(undefined);
  const [cognitoError, setCognitoError] = useState<string>('');
  const [values, setValues] = useState<State>({
    firstPassword: '',
    showFirstPassword: false,
    secondPassword: '',
    showSecondPassword: false,
  });

  const singUp = async () => {

    try {
      await Auth.signUp({
        username: username,
        password: values.firstPassword,
        attributes:{
          email
        }
      });
      
      dispatch(updateUserStore({...user, email}));
      setOpen(false);
      setOpenLoginDialog(true)
      setOpenSuccessSnackbar(true);
    } catch (error) {
      setCognitoError(!error.message ? error : error.message);
    }

  };

  const handleFirstPasswordChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, firstPassword: event.target.value });
    setIs1PassValid(event.target.value !== '');
  };
  const handleClickShowFirstPassword = () => {
    setValues({ ...values, showFirstPassword: !values.showFirstPassword });
  };

  const handleSecondPasswordChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, secondPassword: event.target.value });
    setIs2PassValid(event.target.value === values.firstPassword);
  };
  const handleClickShowSecondPassword = () => {
    setValues({ ...values, showSecondPassword: !values.showFirstPassword });
  };

  const handleUsernameChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setIsUsernameValid(event.target.value !== '');
  };

  const handleEmailChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setIsEmailValid(event.target.value !== '');
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <div>
      <Dialog onClose={() => setOpen(false)} aria-labelledby="customized-dialog" open={open} fullWidth>
        <DialogTitle id="customized-dialog" onClose={() => setOpen(false)}>
          Sign Up
        </DialogTitle>
        <DialogContent dividers>
          <FormControl className={clsx(globalClasses.margin, globalClasses.textField)} variant="outlined" fullWidth >
            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email"
              type={'text'}
              value={email}
              required
              onChange={handleEmailChange()}
              labelWidth={70}
              error={email === ''}
            />
            {isEmailValid === false && <span className={globalClasses.errorText}>The email is required!</span>}
          </FormControl>
          <FormControl className={clsx(globalClasses.margin, globalClasses.textField)} variant="outlined" fullWidth >
            <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
            <OutlinedInput
              id="outlined-adornment-username"
              type={'text'}
              value={username}
              required
              onChange={handleUsernameChange()}
              labelWidth={70}
              error={username === ''}
            />
            {isUserNameValid === false && <span className={globalClasses.errorText}>The username is required!</span>}
          </FormControl>
          <FormControl className={clsx(globalClasses.margin, globalClasses.textField)} variant="outlined" fullWidth >
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={values.showFirstPassword ? 'text' : 'password'}
              value={values.firstPassword}
              required
              onChange={handleFirstPasswordChange()}
              error={values.firstPassword === ''}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowFirstPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showFirstPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
            {is1PassValid === false && <span className={globalClasses.errorText}>The password is required!</span>}
          </FormControl>
          <FormControl className={clsx(globalClasses.margin, globalClasses.textField)} variant="outlined" fullWidth >
            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type={values.showSecondPassword ? 'text' : 'password'}
              required
              value={values.secondPassword}
              onChange={handleSecondPasswordChange()}
              error={values.secondPassword === '' || values.secondPassword !== values.firstPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowSecondPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showSecondPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={132}
            />
            {is2PassValid === false && <span className={globalClasses.errorText}>The two passwords don't match!</span>}
          </FormControl>
          {cognitoError !== '' ? <span className={globalClasses.errorText}>{cognitoError}</span> : null}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={singUp} color="primary" disabled={!isEmailValid || !isUserNameValid || !is1PassValid || !is2PassValid}>
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={openSuccessSnackbar}
        onClose={() => setOpenSuccessSnackbar(false)}
        key={uuidv4()}
        >
        <Alert onClose={() => setOpenSuccessSnackbar(false)} severity="success">
            You have successfully registered
            We've sent you an email. Please click on the confirmation link to verify your account.
        </Alert>
        </Snackbar>
    </div>
  );
};

export default SignUp;