import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, DialogActions } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from "redux";

import AutosuggestField from './AutosuggestField';
import ActivityModeSelector from './ActivityModeSelector';

import { requestStudentsFromClassroom } from '../../sagaRequest/requestStudents';

var gameId = 0;

const styles = theme => ({
    StartActivityDialog: {
    },
    StartActivityDialogTitle: {

    },
    StartActivityDialogContent: {
    }
});

class StartActivityDialog extends Component {
    constructor(props) {
        super(props);
        const activity = props.activity;
        this.state = {
            activityName: activity.name,
            activityDescription: activity.description,
            classroomStudents: null,
            suggestionsDictionnary: null,
        }
        this.listChildRef = React.createRef();
        this.radioChildRef = React.createRef();
        requestStudentsFromClassroom(this.props.classroomId, this.handleUpdateClassroom);
    }
    updateTargetActivity(newActivityInfo) {
        var tmp_state = this.state;
        tmp_state.activityName = newActivityInfo.name;
        tmp_state.activityDescription = newActivityInfo.description;
        this.setState(tmp_state);
    }
    handleUpdateClassroom = (new_student_list) => {
        if (new_student_list == null)
            return;
        var result = [];
        if (new_student_list != null) {
            new_student_list.forEach(element => {
                result.push({
                    label: element.name + " " + element.firstname,
                    suggestions: [element.name, element.firstname],
                    value: element.id
                });
            }, result);
        }
        this.setState(
            {
                classroomStudents: new_student_list,
                suggestionsDictionnary: result,
            }
        );
    }
    updateStudentList = (new_list) => {
        this.listChildRef.updateInputList(new_list);
    }
    startActivity = () => {
        const list = this.listChildRef.current.getList()
        if (list == null || list.length === 0) {
            this.props.displayMessage("Il y a comme un problème...", "Il faut au moins un élève pour lancer une activité.", true);
            return;
        }
        const input = list.map((value) => {
                return ({ label: value.label, value: value.value.value, });
            }
        );
        const mode = this.radioChildRef.current.getResult();
        if (mode === "") {
            this.props.displayMessage("Il y a comme un problème...", "Il faut choisir le mode d'activité pour lancer cette dernière.", true)
            return;
        }
        this.activity_input = {
            students: input,
            mode: mode,
        };
        this.props.on_validation(this.activity_input);
    }
    downloadActivity = () => {
      //console.log(this.state);
      //this.props.onRequestDownload();
    }


    displayActivityInfo = () => {
        this.props.displayMessage(this.state.activityName, this.state.activityDescription, true);
    }
    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };
    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;
        return (
            <div>
              {this.props.activity.etat === true ?
                <Dialog fullWidth={true} maxWidth = {'md'} className={classes.StartActivityDialog} onClose={this.handleClose} {...other}>
                    <DialogTitle className={classes.StartActivityDialogTitle}>Commencer l'activité : {this.state.activityName}</DialogTitle>
                    <DialogContent className={classes.StartActivityDialogContent}>
                        <ActivityModeSelector ref={this.radioChildRef} />
                        <AutosuggestField
                            placeholder="Choisir les élèves qui participeront à l'activité"
                            suggestions={this.state.suggestionsDictionnary}
                            ref={this.listChildRef}
                        />
                    </DialogContent>
                    <DialogActions >
                        <Button fullWidth={true} onClick={this.displayActivityInfo}>À propos de {this.state.activityName}</Button>
                        <Button fullWidth={true} onClick={this.startActivity}>Commencer la Session</Button>
                    </DialogActions>
                </Dialog>
            :
                <Dialog fullWidth={true} maxWidth = {'md'} className={classes.StartActivityDialog} onClose={this.handleClose} {...other}>
                    <DialogTitle className={classes.StartActivityDialogTitle}>Activité : {this.state.activityName}</DialogTitle>

                    <DialogActions >
                        <Button fullWidth={true} onClick={this.displayActivityInfo}>À propos de {this.state.activityName}</Button>
                        <Button fullWidth={true} onClick={this.downloadActivity}>Installer l'activité</Button>
                    </DialogActions>
                </Dialog>
              }
            </div>
        );
    }
};

const mapStateToProps = state => {

};

const mapDispatchToProps = dispatch => {
  return {
    onRequestDownload: () => dispatch({ type: "DOWNLOAD_GAME", gameId}),
  };
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(StartActivityDialog);
