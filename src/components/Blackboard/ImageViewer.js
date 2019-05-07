import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Theme} from "../../utils/Theme";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import {Card, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import ReactPlayer from "react-player";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import ZoomPlus from "@material-ui/icons/ZoomIn"
import ZoomMinus from "@material-ui/icons/ZoomOut";


const styles = {
  appBar: {
    position: 'relative',
  },
  noPad: {
    padding: '0'
  },
  test:{
/*  top: "50%",
  left:"50%",
    transform: "translate(-50%, -50%)",*/
    position: "relative"
  }


};

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ImageViewer extends Component {

    constructor(props) {

        super(props);

        this.state = {
          zoom: 100
        };

    }

    zoom = () =>{
        this.setState({zoom: this.state.zoom += 10});
    }

    unzoom = () =>{
      if (this.state.zoom > 0)
        this.setState({zoom: this.state.zoom -= 10});

    }

    render() {

      const { classes } = this.props;

        return (
            <div>
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
                    <Typography variant="h6" color="inherit" className={classes.flex}>
                      {this.state.zoom + '%'}
                    </Typography>
                    <Button color="inherit" onClick={this.zoom}>
                      <ZoomPlus style={{width: '1.5em', height: '1.5em'}}/>
                    </Button>
                    <Button color="inherit" onClick={this.unzoom}>
                      <ZoomMinus style={{width: '1.5em', height: '1.5em'}}/>
                    </Button>
                  </Toolbar>
                </AppBar>
                <DialogContent  style={{backgroundColor: 'rgb(254, 239, 194)', textAlign: 'center', width: "100%", height:"100%", display: 'block', position: 'relative'}} classes={{ root: classes.noPad }}>
                    <img className={classes.test} src={"http://176.31.252.134:7001/files/fm/" + this.props.path} style={{width: this.state.zoom + '%'}}/>
                </DialogContent>
              </Dialog>
            </div>
        );
    }

}

ImageViewer.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {

    return {};

};

const mapDispatchToProps = dispatch => {

    return {};

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ImageViewer)));
