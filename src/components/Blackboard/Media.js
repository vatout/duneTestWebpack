import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import { Theme } from '../../utils/Theme';
import Grid from '@material-ui/core/Grid';
import ReactPlayer from 'react-player';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  dashedColorSecondary: {
    backgroundImage: "",
  },
};

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
    console.log('onProgress', state);
    this.setState({ timePlayed: state.played * 100 });
    this.setState({ timeLoaded: state.loaded * 100 });
  }

  onDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration })
  }

  handleUp = () => {
     this.setState({ volume: this.state.volume + 0.1 });
  }

  handleDown = () => {
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
    console.log (classes);

    return (
      <div style={Theme.root}>
        <Button>
          <Link to="/blackboard">
            <img src={require("../../assets/logo_back.png")} alt="back"></img>
          </Link>
        </Button>
        <Grid
        container spacing={0}
        direction="row"
        justify="center"
        alignItems="center"
        style={{ minHeight: '0vh' }}>
          <ReactPlayer
            style={{margin: 0}}
          className='react-player'
          //url='https://www.youtube.com/watch?v=udFlaqoKMDk'
          url='https://www.dailymotion.com/video/x1wuq0h'
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
          style={{ minHeight: '0vh' }}>
          <img src={require("../../assets/void.png")} alt="" ></img>
          <img src={require("../../assets/void.png")} alt="" ></img>
         <Button onClick={this.handlePlay} color="secondary">
          <img src={require("../../assets/logo_backward.png")} alt="" ></img>
        </Button>
        <Button onClick={this.handlePlay} color="secondary">
          <img src={require("../../assets/logo_play.png")} alt="" ></img>
        </Button>
        <Button onClick={this.handlePlay} color="secondary">
          <img src={require("../../assets/logo_forward.png")} alt="" ></img>
        </Button>
        <Button onClick={this.handleDown} color="secondary">
          <img src={require("../../assets/volume_down.png")} alt="" ></img>
        </Button>
        <Button onClick={this.handleUp} color="secondary">
          <img src={require("../../assets/volume_up.png")} alt="" ></img>
        </Button>
        <Button onClick={this.handleMute} color="secondary">
          <img src={require("../../assets/volume_muted.png")} alt="" ></img>
        </Button>
        <img src={require("../../assets/void.png")} alt="" ></img>
        <img src={require("../../assets/void.png")} alt="" ></img>
        </Grid>
      </div>

    );
  }
}
Media.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Media);
