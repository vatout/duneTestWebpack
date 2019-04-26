import React from 'react';

import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import Grid from '@material-ui/core/Grid';

import {Theme} from '../../utils/Theme'

class SwitchListSecondary extends React.Component {
  state = {
    checked: ['wifi'],
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  render() {
    return (
      <div style={Theme.root}>
      <Grid
      container
      alignItems="flex-start"
      justify="flex-start">
        <Button>
          <Link to="/menu">
            <img src={require("../../assets/logo_back.png")} alt="back"></img>
          </Link>
        </Button>
        </Grid>
        <Grid>
        <List subheader={<ListSubheader style={styles}>Paramètres</ListSubheader>}>
          <ListItem>
            <ListItemIcon>
              <WifiIcon />
            </ListItemIcon>
            <ListItemText primary="Wi-Fi" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle('wifi')}
                checked={this.state.checked.indexOf('wifi') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BluetoothIcon />
            </ListItemIcon>
            <ListItemText primary="Bluetooth" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle('bluetooth')}
                checked={this.state.checked.indexOf('bluetooth') !== -1}/>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
        </Grid>
      </div>
    );
  }
}

const styles = {
  fontSize: 30,
}

SwitchListSecondary.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (SwitchListSecondary);
