import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, DialogActions, Typography } from '@material-ui/core';

export default class InfoMessageDialog extends Component {
    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose}>
                <DialogTitle><Typography>{this.props.title}</Typography></DialogTitle>
                <DialogContent><Typography>{this.props.message}</Typography></DialogContent>
                <DialogActions><Button onClick={this.props.onClose} fullWidth={true}>D'accords</Button></DialogActions>
            </Dialog>
        );
    }
}