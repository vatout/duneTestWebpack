import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { GridListTile, Card, CardMedia, CardHeader, CardContent } from '@material-ui/core';

export default class LibraryListItem extends Component {
    constructor(props) {
        super(props);

    }
    getTruncatedName(name) {
        if (name.length <= 15)
            return (name);
        return (name.substring(0, 12) + "...");
    }
    render() {
        const src = this.props.pic;
        const truncatedName = this.getTruncatedName(this.props.name)
        return (
            <GridListTile onClick={this.props.onClick} style={{marginTop: 60, margin: 30, }} >
                <Card style={{flex: 1, borderRadius: 20, backgroundColor: '#cabd91'}}>
                    <div style={{}}>
                      <img style={{height: 300, width: undefined}} src={src} alt={this.props.name} resizeMode="contain"/>
                    </div>
                    <CardHeader style={{width:"100%", height:"10%", overflowX:"hidden", overflowY:"hidden", whiteSpace: "nowrap"}}title={truncatedName}/>
                </Card>
            </GridListTile>
        );
    }
}
