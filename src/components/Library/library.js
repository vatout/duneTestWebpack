import React, { Component } from 'react';

import { connect } from "react-redux";
import { Theme } from '../../utils/Theme';
import Grid from '@material-ui/core/Grid';

import { Redirect } from 'react-router-dom';
import StartActivityDialog from '../activity_launch/StartActivityDialog';
import CloseActivityDialog from '../activity_launch/CloseActivityDialog';
import DownloadAppDialog from './DownloadAppDialog'
import InfoMessageDialog from '../InfoMessageDialog';
import LibraryList from './LibraryList';
import DownloadActivityDialog from '../activity_launch/DownloadActivityDialog';

const StartActivityDialogWrapped = StartActivityDialog;
const CloseActivityDialogWrapped = CloseActivityDialog;
const DownloadAppDialogWrapped = DownloadAppDialog;
const DownloadActivityDialogWrapped = DownloadActivityDialog;

class Library extends Component {
  constructor(props) {
    super(props);
    if (props.location != null && props.location.state != null) {
      this.activity_output = props.location.state;
    }
    this.activity = {};
    this.startActivityDialogRef = React.createRef();
    this.state = {
      redirect: false,
      openStartActivity: false,
      openDownloadActivity: false,
      openCloseActivity: false,
      openAppQueue: false,
      activityInfo: this.activity,
      activityInput: {},
      activityOutput: {},
      activityEtat: false,
      message_title:null,
      message:null,
      error:false,
      info:false,
    }
    if (this.activity_output != null) {
      this.activityEnded(this.activity_output);
    }
  }
  activityEnded(output) {
    var tmp_state = this.state;
    tmp_state.activityOutput = output;
    if (output != null && output.error === false) {
      tmp_state.openCloseActivity = true;
    }
    this.setState(tmp_state);
  }
  activityDone() {
    this.activity_output = null;
  }
  launchActivity() {
    var tmp_state = this.state;
    tmp_state.redirect = true;
    this.setState(tmp_state);
  }
  displayInfo = (message_title, message, error) => {
    var tmp_state = this.state;
    tmp_state.message_title = message_title
    tmp_state.message = message;
    tmp_state.error = error;
    tmp_state.info = true;
    this.setState(tmp_state);
  }
  hideError = () => {
    var tmp_state = this.state;
    tmp_state.message_title = null;
    tmp_state.message = null;
    tmp_state.error = false;
    tmp_state.info = false;
    this.setState(tmp_state);
  }
  handleClickOpenStartActivity = (path, activityName, description, etat) => {
    console.log("handleClickOpenStartActivity");
    this.activity_path = path;
    var tmp_state = this.state;
    tmp_state.activityInfo.name = activityName;
    tmp_state.activityInfo.description = description;
        tmp_state.activityInfo.etat = etat
    this.startActivityDialogRef.current.updateTargetActivity(tmp_state.activityInfo);
    this.setState(tmp_state);
    tmp_state.openStartActivity = true;
    this.setState(tmp_state);
  };
  // handleClickOpenInfoActivity = (path, activityName, description, etat) => {
  //   this.activity_path = path;
  //   var tmp_state = this.state;
  //   tmp_state.activityInfo.name = activityName;
  //   tmp_state.activityInfo.description = description;
  //   tmp_state.activityInfo.etat = etat
  //   this.startActivityDialogRef.current.updateTargetActivity(tmp_state.activityInfo);
  //   this.setState(tmp_state);
  //   tmp_state.openStartActivity = true;
  //   this.setState(tmp_state);
  // };
  handleCloseStartActivityDialog = (value) => {
    var tmp_state = this.state;
    tmp_state.activityInput = value;
    tmp_state.activity = {};
    tmp_state.openStartActivity = false;
    this.setState(tmp_state);
  };
  handleValidationStartActivityDialog = (value) => {
    console.log("handleValidationStartActivityDialog");
    this.handleCloseStartActivityDialog(value);
    this.launchActivity();
  }
  handleClickOpenCloseActivity = () => {
    var tmp_state = this.state;
    tmp_state.openCloseActivity = true;
    this.setState(tmp_state);
  }
  handleCloseCloseActivityDialog = () => {
    console.log("handleCloseCloseActivityDialog");
    var tmp_state = this.state;
    tmp_state.openCloseActivity = false;
    this.setState(tmp_state);
    this.activityDone();
  }
  handleRestartCloseActivityDialog = () => {
    this.handleCloseCloseActivityDialog();
    this.handleClickOpenStartActivity(this.state.activityOutput.game_path);
  }
  handleToggleAppQueue = (value) => {
    var tmp_state = this.state;
    tmp_state.openAppQueue = value;
    this.setState(tmp_state);
  }
  render() {
    if (this.state.redirect === true) {
      const input = this.state.activityInput;
      const redirection_object = {
        pathname: this.activity_path,
        state: input,
        game_path: this.activity_path,
      };
      return (<Redirect push to={redirection_object} />);
    }
    var classroom = null;
    if (this.state.activityInfo != null) {
      classroom = this.state.activityInfo.classroom;
    }
    return (
      <div style={Theme.root}>
        <Grid
          style={{width:"100%"}}
          container
          alignItems="flex-start"
          justify="flex-start">

        </Grid>
        <LibraryList
          download={() => this.handleToggleAppQueue(true)}
          launch={this.handleClickOpenStartActivity}
        />
        <DownloadAppDialogWrapped
          open={this.state.openAppQueue}
          onClose={() => {this.handleToggleAppQueue(false)}}
        />
        <StartActivityDialogWrapped
          open={this.state.openStartActivity}
          onClose={this.handleCloseStartActivityDialog}
          on_validation={this.handleValidationStartActivityDialog}
          activity={this.state.activityInfo}
          classroomStudents={classroom}
          innerRef={this.startActivityDialogRef}
          classroomId={2}
          displayMessage={this.displayInfo}
        />
        <CloseActivityDialogWrapped
          open={this.state.openCloseActivity}
          onClose={this.handleCloseCloseActivityDialog}
          restart={this.handleRestartCloseActivityDialog}
          change={this.handleCloseCloseActivityDialog}
          activity={this.state.activityInfo}
          result={this.state.activityOutput}
        />
        <DownloadActivityDialogWrapped
          open={this.state.openDownloadActivity}
          onClose={this.handleCloseStartActivityDialog}
          on_validation={this.handleValidationStartActivityDialog}
          activity={this.state.activityInfo}
          classroomStudents={classroom}
          innerRef={this.startActivityDialogRef}
          classroomId={2}
          displayMessage={this.displayInfo}
        />
        <InfoMessageDialog
          open={this.state.info}
          title={this.state.message_title}
          message={this.state.message}
          onClose={this.hideError}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.fetching,
    dog: state.dog,
    error: state.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestRegister: () => dispatch({ type: "API_LICENCE_REQUEST" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Library);
