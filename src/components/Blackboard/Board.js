import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

import { Theme } from '../../utils/Theme';

export default class Board extends Component {

  render() {
    return (
      <div style={Theme.root}>
      <Grid container
        spacing={0}
        alignItems="flex-start"
        justify="flex-start"
        style={{ minHeight: '20vh' }}>
        <Button>
          <Link to="/menu">
            <img src={require("../../assets/logo_back.png")} alt="back"></img>
          </Link>
        </Button>
        </Grid>
        <Grid container
          spacing={0}
          alignItems="center"
          justify="space-evenly"
          style={{ minHeight: '60vh' }}>
        <Button>
          <Link to="/paint">
            <img src={require("../../assets/logo_paint.png")} alt="Bibliothèque"></img>
          </Link>
        </Button>
        <Button>
          <Link to="/files">
            <img src={require("../../assets/logo_media.png")} alt="tableau"></img>
          </Link>
        </Button>
        </Grid>
      </div>
    );
  }
}
