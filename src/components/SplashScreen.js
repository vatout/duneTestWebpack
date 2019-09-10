import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';

import { Theme } from '../utils/Theme';

export default class SplashScreen extends Component {
  state = {
    redirect: false,
    redirectInstall: false,
  };

  handleClickCard = () => {
    console.log('handleClick')
    const licence = localStorage.getItem("licence");
    if (licence === null) {
      this.setState({redirectInstall: true});
    } else {
      this.setState({redirect: true});
    }
  }

  render() {

    if (this.state.redirect) {
      return <Redirect push to="/Login" />;
    } else if (this.state.redirectInstall) {
      return <Redirect push to="/Install" />;
    } else {
      return (
        <div style={Theme.root}>
          <Grid container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
          >
              <Card style={{maxWidth: 800,}}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    alt="Dune"
                    height="100%"
                    image={require("../assets/logo.png")}
                    title="Dune"
                    onClick={this.handleClickCard}
                  />
                </CardActionArea>
              </Card>
          </Grid>
        </div>
      );
    }
  }
}
