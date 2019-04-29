import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/es/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import DialogActions from "@material-ui/core/es/DialogActions";
import Button from "@material-ui/core/Button";
import classNames from 'classnames';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';

const styles = {
  textField:{
    width: '100%'
  }
};

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

class LibraryFilters extends Component {

    constructor(props) {

        super(props);

        this.state = {
          open: false,
          recherche: '',
          type: null
        };

    }

    componentDidMount() {
      this.setState({type: this.props.mode});
    }

  componentWillUpdate(nextProps, nextState, nextContext) {
      if (this.state.open != nextProps.open){
        this.setState({open: nextProps.open});
      }
      if (this.state.type != nextProps.mode){
        this.setState({type: nextProps.mode});
      }
    }

    searchFilters = () =>{

      switch (this.state.type){
        case 0:
          this.props.getGamesInstalled(this.props.token, this.state.recherche);
          break;
        case 1:
          this.props.getGamesNotInstalled(this.props.token, this.state.recherche);
          break;
      }
      this.handleClose();
    }

    handleChange = (event, value) => {
      this.setState({ [event.target.name]: event.target.value });
    };

  handleClose = () => {
    this.setState({ open: false });
    this.props.handleOpened(false);
    this.setState({recherche: ''})
  };

  render() {
      const classes = this.props;
        return (
              <div>
                <Dialog
                  disableBackdropClick
                  disableEscapeKeyDown
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="customized-dialog-title"
                  fullWidth={true}
                >
                  <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                    Rechercher par nom de jeu
                  </DialogTitle>
                  <DialogContent style={{padding: '24px 24px 24px', borderBottom: '1px solid #e0e0e0'}}>
                    <Grid container className={classes.root} spacing={32}>
                      <Grid item xs={12}>
                        <Grid container spacing={16}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              id="outlined-simple-start-adornment"
                              variant="outlined"
                              label="Rechercher par nom"
                              value={this.state.recherche}
                              name={'recherche'}
                              onChange={this.handleChange}
                              InputProps={{
                                startAdornment: <InputAdornment position="end">
                                  <Search>
                                  </Search>
                                </InputAdornment>
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                    </Grid>
                  </DialogContent>
                  <DialogActions >
                    <Button variant="contained" color="secondary" className={classes.button} onClick={this.searchFilters}>
                      Rechercher
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
        );
    }

}

LibraryFilters.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {

    return {
      token: state.tokenSession.tokenSession,
};

};

const mapDispatchToProps = dispatch => {

    return {
      getGamesInstalled: (token, nom) => dispatch({ type: "GET_GAMES_INSTALLED", token, nom }),
      getGamesNotInstalled: (token, nom) => dispatch({ type: "GET_GAMES_NOT_INSTALLED", token, nom }),
    };

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LibraryFilters)));
