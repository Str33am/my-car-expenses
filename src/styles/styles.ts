import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({

  root: {
    height: '56px',
    justifyContent: 'left',
    backgroundColor: '#cecdcd',
  },
  navBotton: {
  },
  navBar: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    backgroundColor: '#83B3AB',
    height: '80px',
  },
  navigation: {
    alignContent: 'flex-start',
    display: 'flex',
    backgroundColor: '#83B3AB',
  },
  avatar: {
    marginLeft: 15,
    marginTop: 2,
    borderRadius: 22,
  },
  main: {
    overflow: 'hidden',
  },
  appName: {
    fontSize: '1rem',
    fontFamily: 'Helvetica',
    fontWeight: 800,
    color: 'black',
    paddingTop: 15,
    display: 'flex',
    marginLeft: 40,
    alignContent: 'flex-start',
  },
  footerText: {
    fontSize: '0.7rem',
    fontFamily: 'Helvetica',
    fontWeight: 200,
    color: 'black',
    padding: 7
  },
  footerContainer: {
    flex: 1,
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: '0',
    height: 30,
    backgroundColor: '#83B3AB',
    zIndex: 999,
    position: 'absolute',
  },
  errorText: {
    color: 'red',
    fontSize: '0.7rem',
    fontFamily: 'Helvetica',
    fontWeight: 200,
  },
  accordionHeading: {
    fontSize: theme.typography.pxToRem(13),
    fontWeight: theme.typography.fontWeightRegular,
  },
  checkboxContainer: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
  datepickerContainer: {

    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  textField: {
    width: '97%',
    marginLeft: 10,
    marginRight: 10
  },
  datepickerTextField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default useStyles;


export const selectDropdownStyle = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    fontSize: 'medium',
    width: '200px',
    cursor: 'pointer',
    color: 'black',
    marginBottom: 15,
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
    width: '200px',
    marginTop: '0',
    borderRadius: '0',
    borderTop: '0',
  }),

};

export const selectDropdownDateStyle = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    fontSize: 'medium',
    width: '110px',
    cursor: 'pointer',
    color: 'black',
    marginBottom: 15,
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
    width: '110px',
    marginTop: '0',
    borderRadius: '0',
    borderTop: '0',
  }),

};