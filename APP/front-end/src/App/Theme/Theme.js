// Material-ui
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

const Theme = createMuiTheme({
    palette: {
      primary: {
        main: blue[700],
      },
      secondary: {
        main: green[500],
      },
    },
    typography: {
      fontFamily: [/* inserire i font qui */].join(',')
    }
});

export default Theme;
