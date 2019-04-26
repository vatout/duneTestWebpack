import React, { Component } from 'react';
import { connect } from "react-redux";

import { Theme } from '../../utils/Theme';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/CloudDownload';


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

  render() {
    console.log(this.state.availableGames);
      return (
        <div style={Theme.root}>
          <div style={Theme.Library}>
            <GridList cellHeight={180} style={Theme.gridList}>
              <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                <ListSubheader component="div">December</ListSubheader>
              </GridListTile>
              {this.state.availableGames.map(tile => (
                <GridListTile key={tile.picPath}>
                  <img src={tile.picPath} alt={tile.name} />
                  <GridListTileBar
                    title={tile.name}
                    subtitle={<span>by: {tile.creator}</span>}
                    actionIcon={
                      <IconButton style={Theme.icon} onClick={() => {this.download(tile.idGame)}}>
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
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
