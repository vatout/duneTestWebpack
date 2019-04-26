import React, { Component } from 'react';
import { connect } from "react-redux";

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { Redirect, } from 'react-router-dom';
import { Theme } from '../../utils/Theme';

var licence = null;
var name = null;

class Install extends Component {
  constructor(props) {
    super(props);
    this.state = {
      licence: "",
      name: "",
    }
  }
  _handleClick = () => {
    console.log("handle")
    licence = this.state.licence;
    name = this.state.name;
    this.props.onRequestRegister();
  }

  render() {
    const idTable = localStorage.getItem("idTable");
    const { fetching, error, message } = this.props;
    console.log("message au render install " + this.props.message);
    return (
      <div style={Theme.root}>
        {this.props.idTable !== null ? (<Redirect to='/login' />) : true}
        {idTable !== null ? (<Redirect to='/login' />) : true}
        <Grid container direction="column" justify="space-around" alignItems="center">
          <Grid item>
            <img src={require('./../../assets/logo.png')} className="App-logo" alt="logo" />
          </Grid>

          <Grid item>
            <h1 className="App-title">Installation</h1>
          </Grid>

          <Grid item>
            <Typography component="p">
              Bienvenu sur Dune, pour utiliser la table veuillez entrer s'il vous plait le numéro de licence qui vous a été fourni
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              ref="name"
              id="filled-full-width"
              label="Nom"
              placeholder="Salle s21"
              margin="normal"
              value={this.state.name}
              style={{backgroundColor: Theme.secondary}}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </Grid>
          <Grid item>
            <TextField
              ref="licence"
              id="filled-full-width"
              label="Licence"
              placeholder="1234567890"
              margin="normal"
              value={this.state.licence}
              style={{backgroundColor: Theme.secondary}}
              onChange={e => this.setState({ licence: e.target.value })}
            />
          </Grid>
          <Grid item>
            {fetching ? (
              <Button color="secondary" size="large" disabled>Récupération ...</Button>
            ) : (
              <Button color="secondary" size="large" onClick={this._handleClick}>
                Valider
              </Button>
            )}
          </Grid>
          <Grid item>
            <Typography component="p">{error && <p style={{ color: "red" }}>{message}</p>}</Typography>
          </Grid>



        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.licence.fetching,
    idTable: state.licence.idTable,
    register: state.licence.licence,
    error: state.licence.error,
    message: state.licence.message,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestRegister: () => dispatch({ type: "API_LICENCE_REQUEST", licence: licence, name: name })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Install);
