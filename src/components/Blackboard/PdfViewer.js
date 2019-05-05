import React, { Component } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from "@material-ui/core/styles/withStyles";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FullScreen from '@material-ui/icons/Fullscreen';
import FullscreenExit from "@material-ui/icons/FullscreenExit";
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import PropTypes from 'prop-types';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import Loader from '../../assets/loaders/loading.gif';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
  },
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const styles = {
  scrollPaper:{
    maxHeight: '100%',
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  full: {
    width: '1.5em',
    height: '1.5em'
  },
  dialog: {
    padding: 0
  }
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Test extends Component {


  constructor(props){

    super(props);

    this.state = {
      numPages: null,
      pageNumber: 1,
      open: true,
      canvasZoomW: "80%",
      canvasZoomH: "80%",
      hide: false,
      fullScreenMode: false,
      initialSize: "null",
      TimeDown: 0,
      TimeUp: 0,
      loading: false

    }

  }

  onDocumentLoadSuccess = ({ numPages }) => {

    this.setState({ numPages });

  }

  changePageNext = () => {

    const canvasStyle = document.getElementsByClassName('react-pdf__Page__canvas');

    if (this.state.pageNumber + 1 <= this.state.numPages) {

      this.setState({pageNumber: this.state.pageNumber + 1});

    }

  }

  changePagePrev = () => {


    if (this.state.pageNumber - 1 > 0) {

      this.setState({pageNumber: this.state.pageNumber - 1});

    }

  }

  onPageLoadSuccess = ({ numPages }) => {

    const canvasStyle = document.getElementsByClassName('react-pdf__Page__canvas');

    canvasStyle[0].style['margin'] = '0 auto';

    if (this.props.mode === "tableau") {

      canvasStyle[0].style['margin-top'] = '64px';

      canvasStyle[0].style['width'] = this.state.canvasZoomH;
      canvasStyle[0].style['height'] = this.state.canvasZoomW;
    }

  }

  renderLoading = () => {

    return (
      <DialogContent>
        <img alt='chargement' src={Loader} style={{display: 'inherit', margin: '0 auto'}} />
      </DialogContent>
    );
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  fullScreenMode = () => {

    this.setState({fullScreenMode: true});

    const canvasStyle = document.getElementsByClassName('react-pdf__Page__canvas');

    canvasStyle[0].style['width'] = "100%";
    canvasStyle[0].style['height'] =  "100%";

    this.setState({canvasZoomW : canvasStyle[0].style['width']});
    this.setState({canvasZoomH : canvasStyle[0].style['height']});

  }

  fullScreenModeExit = () => {

    this.setState({fullScreenMode: false});

    const canvasStyle = document.getElementsByClassName('react-pdf__Page__canvas');

    canvasStyle[0].style['width'] = '80%';
    canvasStyle[0].style['height'] =  '80%';

    this.setState({canvasZoomW : canvasStyle[0].style['width']});
    this.setState({canvasZoomH : canvasStyle[0].style['height']});

  }

  ChangePageFullScreen = (event) => {


    if (this.state.fullScreenMode){

      var posX = event.clientX;

      if (posX > (window.innerWidth / 2)){
        this.changePageNext();
      }
      else if (posX < (window.innerWidth / 2)){
        this.changePagePrev();
      }

    }


  }

  handleButtonPress = (event) => {

    this.state.TimeDown = event.timeStamp;

  }

  render() {
    const { pageNumber, numPages } = this.state;
    const style = this .props;
    const { classes } = this.props;

    if (this.props.mode === "apercu") {

      return (
        <Dialog
          onClose={this.handleClose}
          open={this.state.open}
          maxWidth={"xl"}
          className={style.scrollPaper}
          scroll="body"
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            Apercu de votre fichier
          </DialogTitle>
          <DialogContent>
            <Document
              file={this.props.url}
              onLoadSuccess={this.onDocumentLoadSuccess}
              loading={this.renderLoading}
              onClick={this.zoomCanvas}
            >
              <Page pageNumber={this.state.pageNumber} onLoadSuccess={this.onPageLoadSuccess} loading={this.renderLoading}/>
            </Document>

          </DialogContent>

          <DialogContent>

            <p style={{textAlign: 'center'}}>Page {pageNumber} sur {numPages}</p>

          </DialogContent>

          <DialogContent>

            {this.state.numPages > 1 ?

              <div style={{textAlign: 'center'}}>
                <Button onClick={this.changePagePrev} variant="contained" color="primary"
                        style={{margin: '2%'}}>
                  Precedent
                </Button>
                <Button onClick={this.handleClose} variant="contained" color="secondary"
                        style={{margin: '2%'}}>
                  CHOISIR
                </Button>
                <Button onClick={this.changePageNext} variant="contained" color="primary"
                        style={{margin: '2%'}}>
                  Suivant
                </Button>
              </div>

              : ""}


          </DialogContent>

        </Dialog>
      );
    }

    else if (this.props.mode === "tableau"){

      return(
        <div>
          <Dialog
            fullScreen
            open={this.state.open}
            onClose={this.props.closeFile}
            TransitionComponent={Transition}
            className={style.scrollPaper}
            classes={{ root:
              classes.dialog
            }}
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
                <Button color="inherit" onClick={this.state.fullScreenMode ? this.fullScreenModeExit : this.fullScreenMode}>
                  {this.state.fullScreenMode ? <FullscreenExit style={{width: '1.5em', height: '1.5em'}}/> : <FullScreen style={{width: '1.5em', height: '1.5em'}}/> }
                </Button>
              </Toolbar>
            </AppBar>

            <DialogContent>

              <Document
                file={this.props.url}
                onLoadSuccess={this.onDocumentLoadSuccess}
                loading={this.renderLoading()}
                onClick={this.ChangePageFullScreen}
                onMouseDown={this.handleButtonPress}
              >

                <Page pageNumber={this.state.pageNumber} loading={this.renderLoading()} onLoadSuccess={this.onPageLoadSuccess}/>
              </Document>
            </DialogContent>

            <DialogContent style={{display: this.state.fullScreenMode ? 'none' : ''}}>


              <p style={{textAlign: 'center'}}>Page {pageNumber} sur {numPages}</p>


            </DialogContent>

            <DialogContent style={{display: this.state.fullScreenMode ? 'none' : ''}}>

              {this.state.numPages > 1 ?

                <div style={{textAlign: 'center'}}>
                  <Button onClick={this.changePagePrev} variant="contained" color="primary"
                          style={{margin: '2%'}}>
                    Precedent
                  </Button>
                  <Button onClick={this.changePageNext} variant="contained" color="primary"
                          style={{margin: '2%'}}>
                    Suivant
                  </Button>
                </div>

                : ""}


            </DialogContent>

          </Dialog>
        </div>
      );
    }
    else{
      return(
        <Loader/>
      );
    }
  }
}

Test.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {


  };
};

const mapDispatchToProps = dispatch => {
  return {
    loading: () => dispatch({ type: "LOADER_START" }),
    not_loading: () => dispatch({ type: "LOADER_END" })
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Test)));
