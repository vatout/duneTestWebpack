import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import { DialogContent, CardMedia, CardContent, Typography, DialogContentText, DialogActions, Grid } from '@material-ui/core';

import Animation from '../Animation/Animation';
import congratPic from '../../assets/thumbsup.png';

const styles = {
    card: {
        width: 300,
        alignContent: "center",
        alignItems: "center",
    },
    media: {
        height: 310,
        width: 300,
        textAlign: "right",
        backgroundSize: "300px 310px",
        background: "no-repeat center",
    },
};

/*
Contained by CloseActivityDialog
Just display the score with a contragulation message.
*/
class ScoreField extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.haveScore = (props.score == null) ? false : true;
        if (this.state.haveScore === true) {
            this.state.score = Math.round(props.score);
        }
    }
    render() {
        if (this.state.handleClose === false) {
            return (null);
        }
        const style = {
            fontSize: "50px",
        };
        return (
            <CardContent>
                <Typography align='center'>Félicitation, vous avez fait un score de :</Typography>
                <Typography style={style} align='center'>{this.state.score} points</Typography>
            </CardContent>
        );
    }
}

/*
Dialog displayed in Library if an activity just ended
*/
class CloseActivityDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            score: props.result.globalScore,
            animationRunning: false,
            active: props.open,
            restart: false,
        }
    }
    handleClose = () => {
        var tmpstate = this.state;
        tmpstate.animationRunning = false;
        this.setState(tmpstate);
        this.props.onClose();
    };
    render() {
        const { classes, onClose, selectedValue, result, ...other } = this.props;
        const activity_name = (result == null) ? "" : result.name;
        return (
            <Dialog fullWidth={true} maxWidth={'md'} onClose={this.handleClose} {...other}>
                <DialogTitle align='center'>L'activité <b>{activity_name}</b> est terminée</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Grid container direction="row">
                            <Grid item xs>
                                <Grid container direction="column" justify="center"
                        alignItems="center">
                                    <Grid item xs>
                                        <ScoreField score={this.state.score} />
                                    </Grid>
                                    <Grid item xs>
                                        <CardMedia className={classes.media} title="Félicitation" image={congratPic} />
                                    </Grid>
                                </Grid>
                                <Animation animation={this.state.animation} run_at_display={true} />
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button fullWidth={true} onClick={this.props.restart}>Recommencer l'activité</Button>
                    <Button fullWidth={true} onClick={this.props.change}>Changer d'activité</Button>
                </DialogActions>
            </Dialog>
        );
    }
};

export default withStyles(styles)(CloseActivityDialog);
