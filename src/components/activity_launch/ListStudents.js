import React, { Component } from 'react';
import {Paper} from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import { ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';

class Student extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            firstname: props.firstname,
            profilePicture: props.profilePicture
        };
    }
    render() {
        return (
            <ListItem>
                <ListItemAvatar>
                    <Avatar alt="" src={this.state.profilePicture.mockupProfilePicture} />
                </ListItemAvatar>
                <ListItemText primary={this.state.name} />
                <ListItemText primary={this.state.firstname} />
            </ListItem>
        );
    }
}

class ListStudents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classroomStudents: props.classroomstudents,
            selectedStudentsIds: []
        };
    }
    getResult() {
        return (this.state.selectedStudentsIds);
    }
    newStudent = (uuid) => {
        var list = this.state.selectedStudentsIds;

        if (uuid == null) {
            return;
        }
        if (!list.includes(uuid)) {
            list.push(uuid);
        }
        this.setState({ selectedStudentsIdslist: list, });
    }
    getSelectedStudents() {
        const ids = this.state.selectedStudentsIds;
        const classroomStudents = this.state.classroomStudents;
        var selectedStudents = [];
        var tmp;

        for (var i = 0; i < classroomStudents.length; ++i) {
            tmp = classroomStudents[i];
            if (ids.includes(tmp.uuid)) {
                selectedStudents.push(tmp);
            }
        }
        return (selectedStudents);
    }
    render() {
        const listSelectedStudents = this.getSelectedStudents()
        const listSelectedStudentsView = listSelectedStudents.map(
            (value) => {
                return (
                    <Student name={value.name} firstname={value.firstname} profilePicture={value.profilePicture} />
                );
            }
        );
        return (
            <Paper style={{ height: 120, overflowY: 'auto' }}>
                <List>
                    {listSelectedStudentsView}
                </List>
            </Paper>
        );
    }
};

export default ListStudents;