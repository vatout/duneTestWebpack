import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { Redirect } from 'react-router-dom';

import { Theme } from '../../utils/Theme';

var QRCode = require('qrcode-react');

var tokenConnect = "";

class Login extends Component {
  state = {
    open: false,
    errorOpen: false,
    completed: 100,
    goAway: false,
    error: null,
    tokenConnect: null,
    message: null,
  };

  progress = () => {
    var { completed } = this.state;
    if (completed < 5) {
      this.setState({ errorOpen: true });
    } else {
      const diff = 4;
      this.setState({ completed: Math.min(completed - diff, 100) });
      if (this.props.professorId == null && completed !== 111) {
        this.props.onRequestAlways(this.props.tokenConnect);
      } else if (this.props.professorId != null) {
        completed = 111;
        this.setState({goAway: true});
      }
    }
  };

  handleClickOpen = () => {
    this.setState({ open: true });
    this.props.onRequestTocken();
    this.timer = setInterval(this.progress, 1000);
  };

  handleClose = () => {
    this.setState({ open: false });
    clearInterval(this.timer);
    this.props.onRequestDelete(this.props.tokenConnect);

  };
  handleClickOpenError = () => {
    clearInterval(this.timer);
    this.setState({ errorOpen: false, completed: 110 });
    this.props.onRequestDelete(this.props.tokenConnect);
    this.props.onRequestTocken();
    this.timer = setInterval(this.progress, 1000);
  };

  handleCloseError = () => {
    this.setState({ completed: 100 });
    clearInterval(this.timer);
    this.props.onRequestDelete(this.props.tokenConnect);
    this.setState({ errorOpen: false, open: false });
  };

  render() {
    const { tokenConnect, error, message } = this.props;
    console.log("tokenConnect au render: ", tokenConnect);
        return (
          <div style={Theme.root}>
            <Grid container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '100vh' }}
            >
              <Grid item xs={8}>
                {this.state.goAway && <Redirect to="/menu" />}
                <Card style={{maxWidth: 800,}}>
                  <CardMedia
                    component="img"
                    alt="Dune"
                    height="450"
                    image={require("../../assets/logo.png")}
                    title="Dune"
                  />
                  <CardContent>
                    <Typography component="p">
                      Pour vous connecter sur votre espace Dune, veuillez préparer le scanner de QRCode depuis votre application mobile
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Button style={{margin: 10}} color="secondary" size="large" onClick={this.handleClickOpen}>
                  Connect
                </Button>
                <Dialog
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Scannez le QRCode"}</DialogTitle>
                  <DialogContent style={{alignItems: 'center'}}>
                    <DialogContentText style={{margin: 10, marginLeft: 200, }} id="alert-dialog-description">
                      {tokenConnect && <QRCode style={{margin: 20}} value={tokenConnect} />}
                      {error && <p style={{ color: "red" }}>{message}</p>}
                    </DialogContentText>
                    <DialogContentText style={{margin: 20}} id="alert-dialog-description">
                      Veuillez scanner ce QRCode avec votre application mobile.
                      Attention ce code n'est valable que 30 secondes.
                    </DialogContentText>
                  </DialogContent>
                  <DialogContent>
                    <LinearProgress style={{background:'#1D1C35'}} variant="determinate" value={this.state.completed} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose} size="large" color="secondary">
                      Fermer
                    </Button>
                  </DialogActions>
                </Dialog>
                <Grid item xs={12}>
                  <Dialog
                    open={this.state.errorOpen}
                    onClose={this.handleCloseError}
                    aria-labelledby="alert-dialog-error"
                    aria-describedby="alert-dialog-description-error"
                  >
                    <DialogTitle id="alert-dialog-error">{"Le QRCode a expiré"}</DialogTitle>
                    <DialogContent style={{alignItems: 'center'}}>
                      <DialogContentText style={{margin: 20}} id="alert-dialog-description-error">
                        Votre QRCode a expiré voulez-vous en regénérer un nouveau ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleClickOpenError} size="large" color="secondary">
                        Oui
                      </Button>
                      <Button onClick={this.handleCloseError} size="large" color="secondary">
                        Annuler
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>

            </Grid>
          </div>

        );
    }
}
const mapStateToProps = state => {
  return {
    error: state.tokenConnect.error,
    message: state.tokenConnect.message,
    tokenConnect: state.tokenConnect.tokenConnect,
    professorId: state.professor.professorId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestTocken: () => dispatch({ type: "API_TOKEN_REQUEST"}),
    onRequestDelete: (tokenConnect) => dispatch({ type: "API_TOKEN_DELETE", tokenConnect }),
    onRequestAlways: (tokenConnect) => dispatch({ type: "API_TOKEN_VALIDATE", tokenConnect })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
