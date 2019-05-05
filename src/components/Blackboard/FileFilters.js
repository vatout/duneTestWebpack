import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/es/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {OutlinedInput} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";

const styles = theme => ({
    card: {
    },
    media: {
        height: 50,
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        maxWidth: 400,
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    textField: {
        flexBasis: 200,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing.unit * 2,
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing.unit,
    },
});

class FileFilters extends Component {

    constructor(props) {

        super(props);

        this.state = {
            open: this.props.open,
            recherche: '',
            fileType: 0,
            private: false,
            classement: 1,
            showPrivate: false
        };

    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (nextProps.open !== this.state.open){
            this.setState({open: nextProps.open});
        }
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    searchFilters = () => {
        this.setState({open: false});
        this.props.getResults(this.props.token, this.state.private, this.state.recherche, this.state.fileType === 0 ? '' : this.state.fileType, this.state.classement);
    }

    handleChange = (event, value) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleCheck = (event, value) => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    open={this.state.open}
                    onClose={this.handleClose}
                    fullWidth={true}
                >
                    <DialogTitle style={{borderBottom: '1px solid #e0e0e0'}}>Ajouter des filtres de recherche</DialogTitle>
                    <DialogContent style={{padding: '24px 24px 24px', borderBottom: '1px solid #e0e0e0'}}>
                        <Grid container className={classes.root} spacing={32}>
                            <Grid item xs={12}>
                                <Grid container spacing={16}>
                                    <Grid item>
                                        <TextField
                                            id="outlined-simple-start-adornment"
                                            className={classNames(classes.margin, classes.textField)}
                                            variant="outlined"
                                            label="Rechercher par titre"
                                            value={this.state.recherche}
                                            name={'recherche'}
                                            onChange={this.handleChange}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="end">
                                                    <Search
                                                      children={null}
                                                        onClick={this.handleClickShowPassword}
                                                    >
                                                    </Search>
                                                </InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel
                                                ref={ref => {
                                                    this.InputLabelRef = ref;
                                                }}
                                                htmlFor="outlined-age-simple"
                                            >
                                                Type
                                            </InputLabel>
                                            <Select
                                                value={this.state.fileType}
                                                onChange={this.handleChange}
                                                input={
                                                    <OutlinedInput
                                                        labelWidth={0}
                                                        name="fileType"
                                                        id="outlined-age-simple"
                                                    />
                                                }
                                            >
                                                <MenuItem value={0}>
                                                    <em>Aucune</em>
                                                </MenuItem>
                                                <MenuItem value={"PDF"}>PDF</MenuItem>
                                                <MenuItem value={"IMG"}>Image</MenuItem>
                                                <MenuItem value={"MP4"}>Vidéo</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControl className={classes.formControl}>
                                            <InputLabel
                                                ref={ref => {
                                                    this.InputLabelRef = ref;
                                                }}
                                                htmlFor="outlined-age-simple"
                                            >
                                                Classer par
                                            </InputLabel>
                                            <Select
                                                value={this.state.classement}
                                                onChange={this.handleChange}
                                                input={
                                                    <OutlinedInput
                                                        labelWidth={0}
                                                        name="classement"
                                                        id="outlined-age-simple"
                                                    />
                                                }
                                            >
                                                <MenuItem value={1}>Type</MenuItem>
                                                <MenuItem value={2}>Nom</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.private}
                                                    name="private"
                                                    onChange={this.handleCheck}
                                                />
                                            }
                                            label="Privés"
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

FileFilters.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {

    return {
        token: state.tokenSession.tokenSession
    };

};

const mapDispatchToProps = dispatch => {

    return {
        getResults: (token, filesPrivate, title, typeF, classement) => dispatch({ type: "GET_FILES", token, filesPrivate, title, typeF, classement })
    };

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FileFilters)));
