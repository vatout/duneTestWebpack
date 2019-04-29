import React, { Component } from 'react';
import { connect } from "react-redux";

import { Theme } from '../../utils/Theme';
import { Grid, GridList, Card, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { Link } from "react-router-dom";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';

import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import InfoIcon from '@material-ui/icons/Info';
import PlayArrowIcon from '@material-ui/icons/PlayCircleOutline';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { Redirect } from 'react-router-dom';

var isInstalled = null;
var etat = false;
var id = null;

function getGameDataObject(name, path, info, picPath, creator, categoryLabel, etat, idGame, idType) {
    return ({
        creator: creator,
        picPath: picPath,
        info: info,
        path: path,
        name: name,
        categoryLabel: categoryLabel,
        etat: etat,
        idGame: idGame,
        idType: idType,
    });
}

class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      installedGames: [],
      availableGames: [],
      loadOnce: true,
      tabs: 0,
    }
  }

  componentDidMount = () => {
    this.props.getGamesInstalled(this.props.token);
    this.props.getGamesNotInstalled(this.props.token);
  }

  componentDidUpdate = () => {
    console.log("componentDidUpdate");
    if (this.props.installed && this.props.available && this.state.loadOnce) {
        this.getGameList();
        this.setState({loadOnce: false});
      }
  }

  handleTabChange = (event, value) => {
    this.setState({ tabs: value });
  };

  fillInstalled = () => {
      isInstalled = true;
      let result = this.props.installed;
      let tmp = [], game= {};
      for (let i = 0; i < result.length; i++) {
      console.log(result);
        game = getGameDataObject(result[i].name, "/games/", "informations sur le jeu", "http://176.31.252.134:7001/files/apps/" + result[i].picPath, result[i].creator, isInstalled, etat, result[i].idGame, result[i].idType);
        tmp.push(game);
      }

      this.setState({installedGames: tmp});
    }

  fillNotInstalled = () => {
      isInstalled = false;
      let result = this.props.available;
      let tmp = [], game= {};
      for (let i = 0; i < result.length; i++) {
        game = getGameDataObject(result[i].name, "/games/", "informations sur le jeu", "http://176.31.252.134:7001/files/apps/" + result[i].picPath, result[i].creator, isInstalled, etat, result[i].idGame, result[i].idType);
        tmp.push(game);
      }
      this.setState({availableGames: tmp});

    }

  getGameList() {
    this.fillInstalled();
    this.fillNotInstalled();
  }

  download(idGame) {
    id = idGame;
    this.props.installProcess(this.props.token);
  }

  renderListTile() {
    let renderList = [];
    let icon = '';
    if (this.state.tabs === 0) {
      renderList = this.state.availableGames;
      icon = (
        <InfoIcon />
      )
    } else {
      renderList = this.state.installedGames;
      icon = (
        <PlayArrowIcon />
      )
    }
    return (
      <GridList cellHeight={180} style={Theme.gridList}>
        {renderList.map(tile => (
          <GridListTile key={tile.picPath}>
            <img src={tile.picPath} alt={tile.name} />
            <GridListTileBar
              title={tile.name}
              subtitle={<span>by: {tile.creator}</span>}
              actionIcon={
                <IconButton style={Theme.icon} onClick={() => {this.download(tile.idGame)}}>
                  {icon}
                </IconButton>
              }
              />
            </GridListTile>

        ))}
      </GridList>
    );
  }

  render() {
    console.log(this.state.availableGames);
      return (
        <div style={Theme.root}>
          <Grid style={{flex: 1, flexDirection: "column"}}>
            <Grid container style={Theme.Library, {minHeight: "75vh"}}>
              { this.renderListTile()}
            </Grid>
            <Grid container style={{flexDirection: "column", paddingBottom: 30, marginBottom: 10}}>
              <Paper>
                <Tabs
                  style={{backgroundColor: '#FEEFC2'}}
                  value={this.state.tabs}
                  onChange={this.handleTabChange}
                  indicatorColor="secondary"
                  centered
                >
                  <Tab label="Activitées installées" />
                  <Tab label="Activitées disponibles" />
                </Tabs>
              </Paper>

              <Grid container style={{flex: 0.9, flexDirection:"row", justifyContent: "center", alignItems: "center"}}>
                <Grid style={{flex: 0.05}}>
                  <Button >
                    <Link to="/menu">
                      <img src={require("../../assets/logo_back.png")} alt="back"></img>
                    </Link>
                  </Button>
                </Grid>

                <Grid style={{flex: 0.05, padding: 20}}>
                  <Button onClick={() => {this.props.download()}}>
                    <img src={require("../../assets/logo_get_app.png")} style={{height:"80px",}} alt="" />
                  </Button>
                </Grid>
              </Grid>

            </Grid>


          </Grid>
        </div>
      );
  }

}

const mapStateToProps = state => {
  return {
    installed: state.games.installed,
    available: state.games.available,
    token: state.tokenSession.tokenSession,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getGamesInstalled: (token) => dispatch({ type: "GET_GAMES_INSTALLED", token }),
    getGamesNotInstalled: (token) => dispatch({ type: "GET_GAMES_NOT_INSTALLED", token }),
    installProcess: (token) => dispatch({ type: "DOWNLOAD_GAME", token, id: id }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Library);
