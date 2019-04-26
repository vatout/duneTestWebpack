import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemIcon, ListItemText, IconButton, ListItemSecondaryAction, DialogActions, Button } from '@material-ui/core';
import picPath from "./../../assets/jeu.png";
import logo_ok from "./../../assets/logo_ok_black.png";
import logo_nok from "./../../assets/logo_get_app_black.png";
import logo_wait from "./../../assets/logo_wait_black.png";

class AppListItem extends Component {

    render() {
        const ok = <img style={{textAlign:"center"}}src={logo_ok} width="50vw" height="50vh" alt="" />;
        const nok = <img style={{textAlign:"center"}}src={logo_nok} width="50vw" height="50vh" alt="" />;
        const wait = <img style={{textAlign:"center"}}src={logo_wait} width="50vw" height="50vh" alt="" />;
        const img = <img style={{ textAlign: "center" }} src={this.props.iconPath} width="50vw" height="50vh" alt="" />;
        var stateimg;
        if (this.props.downloading === true)
            stateimg = wait;
        else if (this.props.validated === true)
            stateimg = ok;
        else
            stateimg = nok;
        return (
            <ListItem button>
                <ListItemIcon>
                    {img}
                </ListItemIcon>
                <ListItemText primary={this.props.name} secondary={this.props.description} />
                <ListItemSecondaryAction>
                    <IconButton>
                        {stateimg}
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

function mockupAppList() {
    function mockuplistitem(name, description, icon, validated, downloading) {
        return ({
            name:name,
            description:description,
            iconPath:icon,
            validated:validated,
            downloading:downloading,
        });
    }
    return (
        [
            mockuplistitem("nom1", "description1", picPath, true, false),
            mockuplistitem("nom2", "description2", picPath, true, false),
            mockuplistitem("nom3", "description3", picPath, false, true),
            mockuplistitem("nom'", "description4", picPath, false, false),
        ]
    );
}

export default class DownloadAppDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appList:null,
        }
        this.getAppList();
    }
    getAppList() {
        this.handleNewAppList(mockupAppList());
    }
    handleNewAppList = (list) => {
        var tmp_state = this.state;
        tmp_state.appList = list;
        this.setState(tmp_state);
    }
    mapList(appList) {

        const result = appList.map(
            (value) => {
                return (<AppListItem name={value.name} iconPath={value.iconPath} description={value.description} validated={value.validated} downloading={value.downloading}/>);
            }
        );
        return (<List>{result}</List>);
    }
    render() {
        const list = this.mapList(this.state.appList);
        return (
            <Dialog fullWidth={true} maxWidth={'md'} onClose={this.props.onClose} open={this.props.open}>
                <DialogTitle>Applications en attente</DialogTitle>
                <DialogContent>
                    {list}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} fullWidth={true}>
                        Quitter
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
