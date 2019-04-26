import { createMuiTheme } from '@material-ui/core/styles';

export const Theme = createMuiTheme({
  overrides:{
    LinearProgress: {
      dashedColorSecondary: {
        backgroundImage: ""
      }
    }
  },
  root: {
    background: '#FEEFC2',
    minHeight: '100vh'
  },
  Library: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: "#FEEFC2",
    gridList: {
      width: 500,
      height: 450,
    },
    icon: {
      color: '#fcd14f',
    },
  },


  typography: {
    useNextVariants: true,
  },
  main: '#FEEFC2',
  primary: '#1D1C35',
  black: '#1D1C35',
  error: '#FEEFC2',
  palette: {
    background: {
      default: '#FEEFC2',
    },
    primary: {
      main: '#FEEFC2',
    },
    secondary: {
      main: '#1D1C35',
      contrastText: '#FEEFC2',
    },
    error: {
      main: '#FEEFC2',
    }
  },
});
