import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import withStyles from "@material-ui/core/styles/withStyles";
import {Dialog, DialogActions} from "@material-ui/core";
import Student from "./StudentList";

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class selectStudents extends Component{
  state = {
    activeStep: 0,
    skipped: new Set(),
    classeName: 0,
    nbElevechoosen: 0,
    studentsArray: []
  };


  componentWillMount(){
    const { getStudents, token } = this.props;
    getStudents(token, this.props.typeUser, this.props.idUser, 0, '');
    this.props.getClasses(token, this.props.typeUser, this.props.idUser);
  }

  changeChoosen = (ch) =>{
    this.setState({nbElevechoosen: ch});
  }

  changeStudentArray = (stu) => {
    this.setState({studentsArray: stu});
  }

  renderClasses() {
    const { classesS } = this.props;
    const classes = [];
    let i = 0;
    let classesLabel = {
      1: 'Petite section',
      2: 'Moyenne Section',
      3: 'Grande section',
      4: 'CP',
      5: 'CE1',
      6: 'CE2',
      7: 'CM1',
      8: 'CM2',
      9: '6e',
      10: '5e',
      11: '4e',
      12: '3e'};
    classes.push(
      <MenuItem id={0} key={i} value={0}>Toutes</MenuItem>
    );
    if (this.props.classesS !== null) {
      for (const data in classesS) {
        classes.push(
          <MenuItem key={classesS[data].idClasse} value={classesS[data].idClasse}>
            {classesLabel[classesS[data].level] + '-' + classesS[data].num}
          </MenuItem>
        );
        i++;
      }
    }
    return classes;
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.props.getStudents(this.props.token, this.props.typeUser, this.props.idUser, event.target.value);
  };

  render() {
    const { classes } = this.props;

    if (this.props.toRender === "info") {
      return (
        <div className={classes.root}>
          <Dialog open={this.props.open}
                  fullWidth={true}
                  maxWidth='lg'>
            <div style={{padding: "2%", textAlign: 'center'}}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Classes</InputLabel>
                <Select
                  value={this.state.classeName}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'classeName',
                    id: 'classe-simple',
                  }}
                >
                  {this.renderClasses()}
                </Select>
              </FormControl>
              <Typography style={{fontSize: '1.5em', color: 'grey', margin: '2%'}}>Vous pouvez choisir {this.props.maxPlayers - this.state.nbElevechoosen} élève(s)</Typography>
            </div>
            <DialogActions style={{margin: '2% auto', display: this.state.nbElevechoosen === this.props.maxPlayers ? 'inherit' : 'none'}}>
              <Button onClick={this.props.launch.bind(this, this.props.idGame, this.props.idTypeGame, this.state.studentsArray)} color="secondary">
                LANCER LE JEU
              </Button>
            </DialogActions>
            <Student students={this.props.students} maxPlayers={this.props.maxPlayers} choosen={this.changeChoosen} changeStudentArray={this.changeStudentArray}/>
          </Dialog>
        </div>
      );
    }else{
      return (
        <div className={classes.root}>
          <Dialog open={this.props.open}
                  fullWidth={true}
                  maxWidth='lg'>
            <div style={{textAlign: 'center'}}>
              Description du jeu
              <Button onClick={this.props.launch.bind(this, this.props.idGame, this.props.idTypeGame, null)} color="secondary">
                Télécharger le jeu
              </Button>
            </div>
          </Dialog>
        </div>
      );
    }
  }

}

const mapStateToProps = state => {
  return {
    students: state.students.content,
    classesS: state.classes.classes,
    state: state,
    token: state.tokenSession.tokenSession
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getStudents: (token, typeUser, idUser, idClasse, search) => dispatch({
      type: 'GET_STUDENTS_REQUEST', token, typeUser, idUser, idClasse, search
    }),
    getClasses: (token, typeUser, idUser) => dispatch({
      type: 'GET_CLASSES_REQUEST', token, typeUser, idUser
    })
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(selectStudents)));
