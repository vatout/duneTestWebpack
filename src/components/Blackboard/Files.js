import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '../../utils/Theme';
import {connect} from "react-redux";
import pdf from "../../assets/library/pdf.png";
import img from "../../assets/library/image.png";
import mp4 from "../../assets/library/video.png";
import '../../assets/scroll.css';
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import {GridList, OutlinedInput, Paper} from "@material-ui/core";
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import LibraryListItem from '../Library/LibraryListItem';
import FileFilters from './FileFilters';
import warning from '../../assets/warning.png';

function getFakeInfo() {
    return ("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
}

function getFileDataObject(name, path, info, picPath, type, categoryLabel, etat) {
    return ({
        type: type,
        picPath: picPath,
        info: info,
        path: path,
        name: name,
        categoryLabel: categoryLabel,
        etat: etat
    });
}

const styles = theme => ({
    card: {
    },
    media: {
        height: 50,
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        maxWidth: 400,
    },
    image: {
        width: 128,
        height: 128,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    textField: {
        flexBasis: 200,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing.unit * 2,
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing.unit,
    },
});

export class FilesList extends Component {
    constructor(props) {
        super(props);
        this.open = React.createRef();
        this.state = {
            share: false,
            fileType: 0,
            open: React.createRef()
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    componentDidMount = () => {
        this.props.getResults(this.props.token, this.state.private, '', 0, 1);
        this.setState({open: false});
    }

    generateFilesList = () => {
        const {classes} = this.props;

        if (this.props.results !== null && this.props.results.length > 0) {
            var id = null;
            var src = null;
            let files = this.props.results.map((file, i) => (
                <LibraryListItem
                    key={i}
                    name={file.nom}
                    pic={file.type === "IMG" ? img : file.type === "PDF" ? pdf : file.type === "MP4" ? mp4 : ''}
                    desc={file.description.substring(0, 20) + '...'}
                />
            ));
            return files;
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.state.open)
            this.setState({open: false});
    }

    render() {
        const classes = this.props;
        return (
            <div  style={Theme.root}>
                <div style={{width: '100%'}}>
                    <div style={{float: 'left', width: '10%'}}>
                        <Button>
                            <Link to="/menu">
                                <img src={require("../../assets/logo_back.png")} alt="back"></img>
                            </Link>
                        </Button>
                    </div>
                    <div style={{margin: '0 auto', width: '300px'}}>
                            <Fab variant="extended" color="primary" aria-label="Add" className={classes.margin} onClick={this.handleClickOpen} style={{margin: '10%'}}>
                                <NavigationIcon className={classes.extendedIcon} />
                                Filtrer la recherche
                            </Fab>
                    </div>
                </div>
                {this.props.results !== null && this.props.results.length > 0 ?
                    <Grid className={classes.root} children={null}>

                        <Grid item xs={12} style={{maxHeight: window.innerHeight - 200, overflowY: 'auto', overflowX: 'hidden'}} children={null}>
                            <GridList
                                children={null}
                                className="defaultScroll"
                                width="auto"
                                cols={4}
                                style={{marginLeft: '8%'}}
                                children={null}>
                            >
                                {this.generateFilesList()}
                            </GridList>
                        </Grid>
                    </Grid>

                    : ''
                        }
                { this.props.results !== null && this.props.results.length === 0 ?
                    <div  style={{textAlign: 'center'}}>
                        <img src={warning} width={200} height={200}/>
                    <div style={{fontSize: '1.5em'}}>
                        Aucun fichier ne correspond à votre recherche. <br/>Pour ajouter un fichier, veuillez vous rendre sur votre espace en ligne dans la rubrique
                    "Gérer mes cours".</div>
                    </div>
                    : ''}

                    <FileFilters open={this.state.open}/>

                    </div>
        );
    }
}

const mapStateToProps = state => {
  return {
    results: state.files.results,
    token: state.tokenSession.tokenSession,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getResults: (token, filesPrivate, title, typeF, classement) => dispatch({ type: "GET_FILES", token, filesPrivate, title, typeF, classement })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(FilesList));
