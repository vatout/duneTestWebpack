import React, { Component } from 'react';

import LibraryListItem from './LibraryListItem';
import { Grid, GridList, Card, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import CategoryPanel from './CategoryPanel';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {connect} from "react-redux";
import './../../assets/scroll.css';
import LibrarySearchBar from './LibrarySearchBar';

function getFakeInfo() {
    return ("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
}

function getGameDataObject(name, path, info, picPath, creator, categoryLabel, etat) {
    return ({
        creator: creator,
        picPath: picPath,
        info: info,
        path: path,
        name: name,
        categoryLabel: categoryLabel,
        etat: etat
    });
}



export class LibraryList extends Component {
    constructor(props) {
        super(props);
        this.categoryPanelRef = React.createRef();
        this.librarySearchBarRef = React.createRef();
        this.state = {
            value: 0,
            searchString: "",
            library_game_list: [],
            available_game_list: [],
            displayed_games: [],
            displayed_games2: [],
            tagsTable: [],
            tagsSelected: [],
            filterTable: [],
            loadOnce: true,
            expanded: null
        };
    }

    componentDidMount = () => {
        this.props.getResults(this.props.token);
        this.props.getResultsNot(this.props.token);
    }

    componentDidUpdate = () => {
      if (this.props.results && this.props.resultsNot && this.state.loadOnce) {
          this.getGameList();
          this.setState({loadOnce: false});
        }
    }

    handleChange = (event, value) => {
      this.setState({ value });
    };

    getFakeList = () => {
        const categoryLabel1 = "label1";
  //      const categoryLabel2 = "label2";
        const etat = false;
        let result = this.props.results;
        let tmp = [], game= {};
        for (let i = 0; i < result.length; i++) {
        console.log(game);
          game = getGameDataObject(result[i].name, "/games/", "informations sur le jeu", "http://176.31.252.134:9001/files/apps/" + result[i].picPath, result[i].creator, categoryLabel1, etat);
          tmp.push(game);
        }
        this.setState({library_game_list: tmp, displayed_games: tmp});
      }

    getTrueList = () => {
        const categoryLabel1 = "label1";
        //      const categoryLabel2 = "label2";
        const etat = false;
        let result = this.props.resultsNot;
        let tmp = [], game= {};
        for (let i = 0; i < result.length; i++) {
          game = getGameDataObject(result[i].name, "/games/", "informations sur le jeu", "http://176.31.252.134:9001/files/apps/" + result[i].picPath, result[i].creator, categoryLabel1, etat);
          tmp.push(game);
        }
        this.setState({available_game_list: tmp, displayed_games2: tmp});
      }

    getGameList() {
      this.getFakeList();
      this.getTrueList();
        var tagsTable = [];
        this.state.library_game_list
            .forEach((value) => {
                if (!tagsTable.includes(value.categoryLabel))
                    tagsTable.push(value.categoryLabel);
            }, tagsTable);
        this.state.available_game_list
            .forEach((value) => {
                if (!tagsTable.includes(value.categoryLabel))
                    tagsTable.push(value.categoryLabel);
            }, tagsTable);
            this.setState({ tagsTable: tagsTable});
    }

    mapList(list) {
        const result = list.map((value) => {
            const onClick = () => this.props.launch(value.path, value.name, value.info, value.etat);
            return (
                <LibraryListItem
                    name={value.name}
                    pic={value.picPath}
                    onClick={onClick}
                />
            );
        })
        return (result);
    }
    filterByTags(list, tags) {
        if (tags !== null && tags !== 0)
            list = list.filter((value) => { return tags.includes(value.categoryLabel) }, tags);
        return (list);
    }
    updateSearch(needle) {
        var tmpstate = this.state;
        tmpstate.searchString = needle;
        tmpstate.displayed_games = this.filterByTags(tmpstate.displayed_games, this.state.tagsSelected);
        tmpstate.displayed_games2 = this.filterByTags(tmpstate.displayed_games2, this.state.tagsSelected);
        this.setState(tmpstate);
        this.search(needle, this.state.filterTable);
    }
    search(needle, tagTable) {
        var tmpstate = this.state;
        if (this.state.searchString != null) {
            tmpstate.displayed_games = this.state.library_game_list
                .filter((value) => {
                    var toCompare;
                    var toDisplay = false;
                    if (tagTable === null || tagTable.length === 0) {
                        toCompare = [
                            value.name,
                            value.creator,
                        ];
                    }
                    else {
                        toCompare = tagTable.map((tag) => { return (value[tag]); }, value);
                    }
                    toCompare.forEach((label) => {
                        const lowerCaseLabel = label.toLowerCase();
                        const lowerCaseNeedle = needle.toLowerCase();
                        const match = lowerCaseLabel.split(' ').filter((toMatch) => { return (toMatch.startsWith(lowerCaseNeedle)); }, lowerCaseNeedle);
                        if (match !== null && match.length !== 0)
                            toDisplay = true;
                    }, needle, toDisplay);
                    return (toDisplay);
                }, needle, tagTable);
        }

        if (this.state.searchString != null) {
            tmpstate.displayed_games2 = this.state.available_game_list
                .filter((value) => {
                    var toCompare;
                    var toDisplay = false;
                    if (tagTable === null || tagTable.length === 0) {
                        toCompare = [
                            value.name,
                            value.creator,
                        ];
                    }
                    else {
                        toCompare = tagTable.map((tag) => { return (value[tag]); }, value);
                    }
                    toCompare.forEach((label) => {
                        const lowerCaseLabel = label.toLowerCase();
                        const lowerCaseNeedle = needle.toLowerCase();
                        const match = lowerCaseLabel.split(' ').filter((toMatch) => { return (toMatch.startsWith(lowerCaseNeedle)); }, lowerCaseNeedle);
                        if (match !== null && match.length !== 0)
                            toDisplay = true;
                    }, needle, toDisplay);
                    return (toDisplay);
                }, needle, tagTable);
        }

        this.setState(tmpstate);
    }
    updateSelectedTags(table) {
        this.search(this.state.searchString, this.state.filterTable);
        var tmpstate = this.state;
        tmpstate.tagsSelected = table;
        tmpstate.displayed_games = this.filterByTags(tmpstate.displayed_games, table);
        tmpstate.displayed_games2 = this.filterByTags(tmpstate.displayed_games2, table);
        this.setState(tmpstate);
    }
    setPanel(panelname) {
        var tmpstate = this.state;
        tmpstate.expanded = this.state.expanded === panelname ? null : panelname;
        this.setState(tmpstate);
    }
    clearFilters() {
        this.categoryPanelRef.current.clear();
        this.librarySearchBarRef.current.clear();
    }
    render() {
        const library_game_list = this.mapList(this.state.displayed_games);
        const available_game_list = this.mapList(this.state.displayed_games2);
        return (
            <Card style={{flex: 1, backgroundColor: '#FEEFC2', justifyContent: "center", alignItems: "center"}}>
              <Card style={{height: "75vh", backgroundColor: '#FEEFC2', padding: 10,}}>
                {this.state.value === 1 ?
                  <GridList
                      className="defaultScroll"
                      cellHeight={160}
                      width="auto"
                      cols={4}
                      style={{ height: "90%", width: "100%", overflowY: "scroll", paddingTop: 50, marginBottom: 50}}
                      alignItems="center"
                  >
                      {available_game_list}
                  </GridList>

                  :
                  <GridList
                      className="defaultScroll"
                      cellHeight={160}
                      width="auto"
                      cols={4}
                      style={{ height: "90%", width: "100%", overflowY: "scroll", paddingTop: 50, marginBottom: 50}}
                      alignItems="center"
                  >
                      {library_game_list}
                  </GridList>
                }

              </Card>
              <Grid container style={{flex: 1, flexDirection: "column", paddingBottom: 30}}>
                <Paper>
                  <Tabs
                    style={{backgroundColor: '#FEEFC2'}}
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="secondary"
                    textColor="#000"
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
                  <Grid style={{flex: 0.7, flexDirection: "column"}}>
                    <Card style={{flex: 1, flexDirection: "row", margin: 10, backgroundColor: '#cabd91'}}>
                        <div position="sticky">
                            <LibrarySearchBar ref={this.librarySearchBarRef} search={(needle) => this.updateSearch(needle)} />
                        </div>
                        <ExpansionPanel style={{backgroundColor: '#cabd91'}} expanded={this.state.expanded === "tags"} onChange={() => this.setPanel("tags")}>
                            <ExpansionPanelSummary>
                                Par Catégorie
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <CategoryPanel ref={this.categoryPanelRef} tags={this.state.tagsTable} onChange={(table) => this.updateSelectedTags(table)} />
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel style={{backgroundColor: '#cabd91'}} onClick={() => {this.clearFilters();}}>
                            <ExpansionPanelSummary>Réinitialiser les filtres</ExpansionPanelSummary>
                        </ExpansionPanel>
                    </Card>
                  </Grid>
                  <Grid style={{flex: 0.05, padding: 20}}>
                    <Button onClick={() => {this.props.download()}}>
                      <img src={require("../../assets/logo_get_app.png")} style={{height:"80px",}} alt="" />
                    </Button>
                  </Grid>

                </Grid>

              </Grid>
            </Card>
        );
    }
}

const mapStateToProps = state => {
  return {
    results: state.games.results,
    resultsNot: state.games.resultsNot,
    token: state.tokenSession.tokenSession,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getResults: (token) => dispatch({ type: "GET_GAMES_INSTALLED", token }),
    getResultsNot: (token) => dispatch({ type: "GET_GAMES_NOT_INSTALLED", token }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LibraryList);
