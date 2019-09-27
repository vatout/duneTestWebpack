import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import DialogActions from "@material-ui/core/es/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Media from './Media';
import Slide from '@material-ui/core/Slide';
import PdfViewer from './PdfViewer';
import ImgViewer from './ImageViewer';
import { URL } from "../../sagaRequest";


const styles = {
  scrollPaper:{
    maxHeight: '100%',
  }};


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ShowFile extends Component {

    constructor(props) {

        super(props);

        this.state = {
          showFile: false
        };

    }

  handleConfirm(confirm){

    if (confirm){
      this.props.closeFileConfirm();
      this.setState({showFile: true});

    }else{
      this.props.closeFileConfirm();
    }

  }

  handleCloseFile = () =>{
      this.setState({showFile: false});
  }

    render() {
        return (
            <div>
              <Dialog
                open={this.props.openConfirm}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    voulez-vous visionner ce fichier ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleConfirm.bind(this, true)} color="primary">
                    Oui
                  </Button>
                  <Button onClick={this.handleConfirm.bind(this, false)} color="primary" autoFocus>
                    Non
                  </Button>
                </DialogActions>
              </Dialog>

              {this.state.showFile ?
                this.props.type === 'IMG' ?
                  <ImgViewer file={this.state.showFile} closeFile={this.handleCloseFile} path={this.props.path} title={this.props.title} />
                 : this.props.type === "PDF" ?
                    <PdfViewer mode={"tableau"} url={URL + "/files/fm/" + this.props.path} title={this.props.title} closeFile={this.handleCloseFile}/>
                    : this.props.type === "MP4" ?
                      <Media path={this.props.path} title={this.props.title} file={this.state.showFile} closeFile={this.handleCloseFile}/>
                      : ''
                    : ''}

            </div>
        );
    }

}

ShowFile.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {

    return {};

};

const mapDispatchToProps = dispatch => {

    return {};

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ShowFile)));
