import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Theme } from '../../utils/Theme';
import Grid from '@material-ui/core/Grid';
import ReactPlayer from 'react-player';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import SkipNext from '@material-ui/icons/SkipNext';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOff from '@material-ui/icons/VolumeOff';
import {Card, Paper} from "@material-ui/core";


const styles = {
  dashedColorSecondary: {
    backgroundImage: "",
  },
  scrollPaper:{
    maxHeight: '100%',
  }};




function Transition(props) {
  return <Slide direction="up" {...props} />;
}



class Media extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isPlayed: false,
      volume: 0.2,
      isMuted: false,
      timePlayed: 0,
      timeLoaded: 0,
    }
}

  handlePlay = () => {
   if (!this.state.isPlayed) {
     this.setState({ isPlayed: true });
   }
  else {
    this.setState({ isPlayed: false });
  }
}

  onProgress = state => {
    this.setState({ timePlayed: state.played * 100 });
    this.setState({ timeLoaded: state.loaded * 100 });
  }

  onDuration = (duration) => {
    this.setState({ duration })
  }

  handleUp = () => {
    if (this.state.volume + 0.1 <= 1)
        this.setState({ volume: this.state.volume + 0.1 });
  }

  handleDown = () => {
    if (this.state.volume - 0.1 >= 0)
      this.setState({ volume: this.state.volume - 0.1 });
}

  handleMute = () => {
   if (!this.state.isMuted) {
     this.setState({ isMuted: true });
   }
  else {
    this.setState({ isMuted: false });
  }
}

  render() {
    const classes = this.props;
    return (
      <div style={Theme.root}>
        <Dialog
          fullScreen
          open={this.props.file}
          onClose={this.props.closeFile}
          TransitionComponent={Transition}
          className={classes.scrollPaper}
          style={Theme.root}
          scroll="body"

        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" onClick={this.props.closeFile} aria-label="Close">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex} style={{width: "90%"}}>
                {this.props.title}
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent style={{backgroundColor: 'rgb(254, 239, 194)'}}>
            <Card>
                <Grid
                        container spacing={0}
                        direction="row"
                        justify="center"
                        alignItems="center">
                        <ReactPlayer
                              style={{margin: 0}}
                            className='react-player'
                              url={[
                                {src: 'http://51.38.187.216:9000/files/fm/' + this.props.path, type: 'video/mp4'},
                              ]}
                            width='1580px'
                            height='820px'

                            onDuration={this.onDuration}
                            onProgress={this.onProgress}
                            playing={this.state.isPlayed}
                            volume={this.state.volume}
                            muted={this.state.isMuted}>
                        </ReactPlayer>
                        </Grid>
                            <LinearProgress style={{margin:"1%", marginRight:"16%", marginLeft:"16%",  height:"20px"}} color="secondary" variant="buffer" value={this.state.timePlayed} valueBuffer={this.state.timeLoaded} />
                        <Grid
                          container spacing={0}
                          direction="row"
                          justify="space-evenly"
                          alignItems="flex-start"
                        style={{marginTop: '2%', marginBottom: '2%'}}
                        >
                          <Paper>
                             <Button onClick={this.handlePlay} color="secondary">
                               <SkipPrevious style={{width: '3.5em', height: '3.5em'}}/>
                            </Button>
                            <Button onClick={this.handlePlay} color="secondary">
                              {this.state.isPlayed ? <Pause style={{width: '3.5em', height: '3.5em'}}/> : <PlayArrow style={{width: '3.5em', height: '3.5em'}}/>}
                            </Button>
                            <Button onClick={this.handlePlay} color="secondary">
                              <SkipNext style={{width: '3.5em', height: '3.5em'}}/>

                            </Button>
                            <Button onClick={this.handleDown} color="secondary">
                              <VolumeDown style={{width: '3.5em', height: '3.5em'}}/>

                            </Button>
                            <Button onClick={this.handleUp} color="secondary">
                              <VolumeUp style={{width: '3.5em', height: '3.5em'}}/>
                            </Button>
                            <Button onClick={this.handleMute} color="secondary">
                              <VolumeOff style={{width: '3.5em', height: '3.5em'}}/>
                            </Button>
                          </Paper>
                    </Grid>
                </Card>
          </DialogContent>
        </Dialog>
      </div>

    );
  }
}
Media.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Media);
