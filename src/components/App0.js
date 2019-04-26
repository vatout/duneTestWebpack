import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Switch, Route, Redirect, } from 'react-router-dom';

import SplashScreen from './SplashScreen';
import Menu from '../navigation/Menu';
import Login from '../navigation/login';
import NoMatch from '../navigation/404';
import Board from './blackboard/Board';
import Paint from './blackboard/paint';
import Library from './Library/library';
import Install from './Install/Install';
import Param from './Param/Param';
import Media from './blackboard/Media';
import Files from './blackboard/Files';

import { theme } from '../utils/Theme';
import { PrivateRoute } from '../utils/PrivateRoute'

import { connect } from "react-redux";

import Invacouleur from '../games/invacouleur/Invacouleur'
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";

import loader from '../assets/loaders/loading.gif';

class App extends Component {

  handleLoading = () => {
    if (this.props.location.pathname === "/") {
      console.log("root");
    }
  }
  render() {
    const licence = localStorage.getItem("licence");
    console.log("licence au démarage", licence);
    return (
        <main>
          <BrowserRouter>
            <MuiThemeProvider theme={theme}>
              <Switch>
                <PrivateRoute exact path='/menu' component={Menu}/>
                <PrivateRoute exact path='/paint' component={Paint}/>
                <PrivateRoute exact path='/blackboard' component={Board}/>
                <PrivateRoute exact path='/library' component={Library}/>
                <PrivateRoute exact path='/media' component={Media}/>
                <PrivateRoute exact path='/param' component={Param}/>
                <PrivateRoute exact path='/files' component={Files}/>
                <Route exact path='/install' component={Install} />
                <Route exact path='/login' component={Login}/>
                <Route exact path='/' component={SplashScreen}/>
                <Route exact path='/games/invacouleur' component={Invacouleur}/>
                <Route component={NoMatch} />
              </Switch>
              {licence == null ? (<Redirect to='/install' />) : true}
            </MuiThemeProvider>
          </BrowserRouter>

          <Dialog
              open={this.props.loading}
              aria-labelledby="form-dialog-title"
          >
            <div>
              <DialogContent>
                <img alt='chargement' src={loader} style={{display: 'inherit', margin: '0 auto'}} />
              </DialogContent>
            </div>
          </Dialog>

        </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    welcome: state.welcome.connection,
    loading: state.loader.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestRegister: () => dispatch({ type: "API_LICENCE_REQUEST" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
