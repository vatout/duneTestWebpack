import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import Grid from '@material-ui/core/Grid';
import { Theme } from './../../utils/Theme';
import dragon from './../../assets/dragon.gif';

export default class SplashScreen extends Component {
  state = {
    redirect: false,
  };

  handleClickBack = () => {
    console.log('handleClick')
    this.setState({redirect: true});
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/menu" />;
    }
    return (
      <div style={Theme.root}>
        <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
          <h1>Error 404</h1>
          <img src={dragon} alt="loading..." />
          <h2>Hi it seems that this page does not exist. No match for <code>{this.props.location.pathname}</code></h2>
            <Button style={{margin: 10}}
              variant="contained"
              size="large"
              color="secondary"
              onClick={this.handleClickBack}>
              Retour
            </Button>
        </Grid>
      </div>
    );
  }
}
