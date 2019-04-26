import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions } from '@material-ui/core';

import { requestStudentsFromClassroom } from '../../sagaRequest/requestStudents';

const styles = theme => ({
    openDownloadActivity: {
    },
    openDownloadActivityTitle: {

    },
    openDownloadActivityContent: {
    }
});

class openDownloadActivity extends Component {
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
    displayActivityInfo = () => {
        this.props.displayMessage(this.state.activityName, this.state.activityDescription, true);
    }
    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };
    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;
        return (
            <Dialog fullWidth={true} maxWidth = {'md'} className={classes.openDownloadActivity} onClose={this.handleClose} {...other}>
                <DialogActions >
                    <Button fullWidth={true} onClick={this.displayActivityInfo}>À propos de {this.state.activityName}</Button>
                    <Button fullWidth={true} onClick={this.startActivity}>Commencer la Session</Button>
                </DialogActions>
            </Dialog>
        );
    }
};

export default withStyles(styles)(openDownloadActivity);
