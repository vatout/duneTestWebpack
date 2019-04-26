import React, { Component } from 'react';

import { Toolbar, TextField } from '@material-ui/core';

export default class LibrarySearchBar extends Component {
    constructor(props) {
        super(props);
        this.textFieldRef = React.createRef();
    }
    changeField(event) {
        this.props.search(event.target.value);
    }
    clear() {
        this.props.search('');
        console.log(this.textFieldRef.current);
        this.textFieldRef.current.value = "";
    }
    render() {
        return (
            <Toolbar>
                <TextField label="Chercher un jeu par nom, par créateur.." fullWidth={true} onChange={(event) => {this.changeField(event)}} ref={this.textFieldRef} />
            </Toolbar>
        )
    }
}
