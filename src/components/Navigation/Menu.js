import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Theme } from '../../utils/Theme';
import { Redirect, Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {connect} from "react-redux";

export class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board: false,
      games: false,
      settings: false,
      open: false,
    }
  }
  componentDidMount = () => {
    if (this.props.connection) {

      console.log(this.props.idProf);

      this.props.getProfsInfos(this.props.idProf, this.props.token);
    }
  }

  handleConnect = () => {
    this.props.onConnect();
  }

  handleDisconnect = () => {
    window.location = '/login';
    this.props.onDisconnect();
  }

  deco = () => {
    this.setState({ open: true });
  }

  decoback = () => {
    window.location = '/menu';
    this.setState({ open: false });
  }

  render() {
    return (
        <div style={Theme.root}>
          <Dialog
              open={this.props.connection}
              onClose={this.handleConnect}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Bonjour {this.props.fname} {this.props.name}, vous êtes bien connecté.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleConnect} color="secondary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
          <Grid container
                spacing={0}
                alignItems="flex-start"
                justify="flex-end"
                style={{ minHeight: '20vh' }}>
            <Button>
              <Link to="/param">
                <img src={require("../../assets/logo_param.png")} alt="parametre"></img>
              </Link>
            </Button>
            <Button onClick= {this.deco}>
              <img src={require("../../assets/logo_power.png")} alt="power"></img>
              <Dialog
                  open={this.state.open}
                  onClose={this.decoback}>
                <DialogContent style={{alignItems: 'center'}}>
                  <DialogContentText style={{margin: 20}} id="alert-dialog-description-error">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleDisconnect} color="secondary">
                    Oui
                  </Button>
                  <Button onClick={this.decoback} color="secondary">
                    Non
                  </Button>
                </DialogActions>
              </Dialog>
            </Button>
          </Grid>
          <Grid container
                spacing={0}
                alignItems="center"
                justify="space-evenly"
                style={{ minHeight: '60vh' }}>
            {this.state.board && <Redirect to="/blackBoard" />}
            {this.state.games && <Redirect to="/Library" />}
            {this.state.settings && <Redirect to="/param" />}
            <Button>
              <Link to="/library">
                <img src={require("../../assets/logo_bibli.png")} alt="Bibliothèque"></img>
              </Link>
            </Button>
            <Button>
              <Link to="/blackBoard">
                <img src={require("../../assets/logo_tableau.png")} alt="tableau"></img>
              </Link>
            </Button>
          </Grid>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    connection: state.welcome.connection,
    name: state.professor.nom,
    fname: state.professor.prenom,
    email: state.professor.email,
    idProf: state.professor.professorId,
    token: state.tokenSession.tokenSession
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onConnect: () => dispatch({ type: "WELCOME_CONNECTION" }),
    onDisconnect: () => dispatch({ type: "USER_LOGOUT" }),
    getProfsInfos: (idProf, token) => dispatch({ type: "GET_PROF_REQUEST", idProf, token }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
