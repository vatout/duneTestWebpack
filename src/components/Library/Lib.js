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
import Refresh from '@material-ui/icons/Refresh';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import InfoIcon from '@material-ui/icons/Info';
import PlayArrowIcon from '@material-ui/icons/PlayCircleOutline';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LibraryFilter from './LibraryFilters';

import { Redirect } from 'react-router-dom';
import Fab from "@material-ui/core/Fab";
import NavigationIcon from "@material-ui/icons/Navigation";
import warning from "../../assets/warning.png";
import FileFilters from "../Blackboard/FileFilters";
import Typography from "@material-ui/core/Typography";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import withStyles from "@material-ui/core/styles/withStyles";
import {FilesList} from "../Blackboard/Files";
import SelectStudents from '../dialogs/SelectStudents';
import { URL } from "../../sagaRequest";


const { ipcRenderer } = require('electron')
var isInstalled = null;
var etat = false;

const styles = theme => ({
  noResults:{
    margin: '0 auto',
    textAlign: 'center'
  },
  GamesList:{
    width: '100%'
  },
  GamesItem:{
    width: '25% !important'
  }
});

function getGameDataObject(name, path, info, picPath, creator, categoryLabel, etat, idGame, idType, url) {
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
    available: [],
    url: url
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
      open: false,
      selectStudentsOpen: false,
      toLaunch: false,
      info: false,
    }
  }

  LaunchBool = () =>{
    this.setState({toLaunch: true});
  }

  componentDidMount = () => {
    this.props.getGamesInstalled(this.props.token, '');
    this.props.getGamesNotInstalled(this.props.token, '');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (this.props.installed !== prevProps.installed || this.props.available !== prevProps.available) {
      this.getGameList();
      this.setState({loadOnce: false});
    }
  }

  handleOpened = () => {
    this.setState({open: !this.state.open});
  }

  handleTabChange = (event, value) => {
    this.setState({ tabs: value });
    switch (value) {
      case 0:
        this.props.getGamesNotInstalled(this.props.token, '');
        break;
      case 1:
        this.props.getGamesInstalled(this.props.token, '');
        break;
    }
  };
  handleSelectStudentsOpen = () => {
    this.setState({selectStudentsOpen: !this.state.selectStudentsOpen});
  }

  fillInstalled = () => {
      isInstalled = true;
      let result = this.props.installed;
      let installedGames = [], game= {};
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          game = getGameDataObject(result[i].name,
            "/games/", "informations sur le jeu",
            URL + "/files/apps/" + result[i].picPath,
            result[i].creator,
            isInstalled,
            etat,
            result[i].idGame,
            result[i].idType);
          installedGames.push(game);
        }
      }
      installedGames.push(getGameDataObject("testGameInstalled",
        "/games/", "informations sur le jeu",
        "../../assets/warning.png",
        "duneFakeCreator",
        "true",
        "false",
        "9999",
        "99",
        ));
      this.setState({installedGames});
    }

  fillNotInstalled = () => {
      isInstalled = false;
      let result = this.props.available;
      let availableGames = [], game= {};
      for (let i = 0; i < result.length; i++) {
        game = getGameDataObject(result[i].name,
          "/games/", "informations sur le jeu",
          URL + "/files/apps/" + result[i].picPath,
          result[i].creator,
          isInstalled,
          etat,
          result[i].idGame,
          result[i].idType);
        availableGames.push(game);
      }
      availableGames.push(getGameDataObject("testGameAvailable",
      "/games/", "informations sur le jeu",
      require("../../assets/warning.png"),
      "duneFakeCreator",
      "false",
      "false",
      "9999",
      "99"));
      this.setState({availableGames});

    }

  getGameList() {
    if (this.props.installed) {
      this.fillInstalled();
    }
    if (this.props.available) {
      this.fillNotInstalled();
    }
  }

  handleShowInfo = (idGame, idTypeGame, content) => {
    console.log("handleShowInfo ");
    if (this.state.tabs === 0 && idGame && idTypeGame && content) {
      this.launch(idGame, idTypeGame, content);
      this.handleSelectStudentsOpen
    } else if (this.state.tabs === 1 && idGame && idTypeGame && content === null) {
      console.log("download");
       this.download(idGame);
       this.handleSelectStudentsOpen
    }
    // if (content === null) {
    //
    // } else {
    //   this.launch(idGame, idTypeGame);
    // }
    // this.setState({selectStudentsOpen: false})
  }

  download(idGame) {
    this.props.installProcess(this.props.token, idGame);

  }

  launch(idGame, idType, players) {
    this.props.launchProcess(this.props.token, idGame, idType, players);

  }
  refresh = () => {
    window.location.reload();
  }

  renderListTile() {
    const {classes} = this.props;
    let renderList = [];
    let icon = '';
    let isEmpty = false;
    if (this.state.tabs === 0) {
      if (this.state.installedGames)
        renderList = this.state.installedGames;
      if (this.state.installedGames.length === 0)
        isEmpty = true;
      icon = (
        <PlayArrowIcon />
      );
    } else {
      if (this.state.availableGames)
        renderList = this.state.availableGames;
      if (this.state.availableGames.length === 0)
        isEmpty = true;
      icon = (
        <InfoIcon />
      )
    }
    if (!isEmpty) {
      return (
        <GridList cellHeight={180} className={classes.GamesList}>
          {renderList.map(tile => (
            <GridListTile key={tile.picPath} className={classes.GamesItem}>
              <img src={tile.picPath} alt={tile.name}/>
              <GridListTileBar
                title={tile.name}
                subtitle={<span>by: {tile.creator}</span>}
                actionIcon={
                  <IconButton style={Theme.icon} onClick={() => {
                    this.setState({selectStudentsOpen: true, info: this.state.tabs === 0, idGame: tile.idGame, idTypeGame: tile.idType})
                  }}>
                    {icon}
                  </IconButton>
                }
              />
            </GridListTile>

          ))}
        </GridList>
      );
    } else if (isEmpty && this.props.installed || this.props.available){
      return (
        <div className={classes.noResults}>
          <img src={warning} width={200} height={200}/>
          <div style={{fontSize: '1.5em'}}>
            <Typography variant="h6">
              Aucun jeu n'a été trouvé.
            </Typography>

          </div>
        </div>
      )
    }

  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };


  render() {
    const classes = this.props;
      return (
        <div style={Theme.root}>
          <div style={{margin: '0 auto', width: '300px'}}>
            <Fab variant="extended" color="primary" aria-label="Add" onClick={this.handleClickOpen} style={{margin: '10%'}}>
              <NavigationIcon className={classes.extendedIcon} />
              Filtrer la recherche
            </Fab>
          </div>
          <Grid style={{flex: 1, flexDirection: "column"}}>
            <Grid container style={Theme.Library, {minHeight: "75vh"}}>
              { this.renderListTile() }
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
                  <Button >
                    <img src={require("../../assets/logo_get_app.png")} style={{height:"80px",}} alt="" />
                  </Button>
                </Grid>
                <Grid style={{flex: 0.05}}>
                  <Button color="secondary" onClick={this.refresh}>
                      <Refresh style={{width: '3em', height: '3em'}}/>
                  </Button>
                </Grid>
              </Grid>

            </Grid>


          </Grid>
          <LibraryFilter open={this.state.open} mode={this.state.tabs} handleOpened={this.handleOpened}/>
          <SelectStudents open={this.state.selectStudentsOpen}
                          launch={this.handleShowInfo}
                          toRender={this.state.info ? "info" : "launch"} maxPlayers={4}
                          idGame={this.state.idGame}
                        idTypeGame={this.state.idTypeGame}
                        handleSelectStudentsOpen={this.handleSelectStudentsOpen}/>
        </div>
      );
  }

}



const mapStateToProps = state => {
  return {
    installed: state.games.installed,
    available: state.games.available,
    token: state.tokenSession.tokenSession,
    download: state.installation.download,
    install: state.installation.installation
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getGamesInstalled: (token, nom) => dispatch({ type: "GET_GAMES_INSTALLED", token, nom }),
    getGamesNotInstalled: (token, nom) => dispatch({ type: "GET_GAMES_NOT_INSTALLED", token, nom }),
    installProcess: (token, id) => dispatch({ type: "DOWNLOAD_GAME", token, id }),
    launchProcess: (token, id, idType, players) => dispatch({
      type: "PROCESS_START", token, id, idType, players
    }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Library));
