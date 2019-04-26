import React, { Component } from 'react';

import { Dialog, DialogTitle, DialogContent, Card, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

/*
Dialog printed when an error occure : purely graphical
props needed are :
 - open (Boolean)
 - message
 - onClose (callback to use on close)
*/
export default class InvacouleurErrorDialog extends Component {
    render() {
        const messageStyle = {
            paddingTop: "10px",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "10px",
        };
        const buttonStyle = {
            marginLeft: "20%",
        };
        return (
            <Dialog open={this.props.open}>
                <DialogTitle>Il y a comme un problème.</DialogTitle>
                <DialogContent>
                    <Card>
                        <Typography style={messageStyle}>
                            {this.props.message}
                        </Typography>
                        <Button onClick={this.props.onClose} style={buttonStyle} color="secondary">
                            Retourner en arrière
                        </Button>
                    </Card>
                </DialogContent>
            </Dialog>
        );
    }
}
