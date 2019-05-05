import React, { Component } from 'react';

import { GridListTile, Card, CardHeader, CardContent, Typography } from '@material-ui/core';

export default class LibraryListItem extends Component {

    getTruncatedName(name) {
        if (name.length <= 15)
            return (name);
        return (name.substring(0, 12) + "...");
    }
    render() {
        const src = this.props.pic;
        const truncatedName = this.getTruncatedName(this.props.name);
        const desc = this.props.desc;
        return (
            <GridListTile onClick={this.props.onClick} style={{width: '15%', textAlign: 'center'}} >
                <Card style={{flex: 1, borderRadius: 20, backgroundColor: '#cabd91', margin: '2%' }}>
                    <CardContent>
                        <div style={{}}>
                          <img height={128} width={128} src={src} alt={this.props.name} resizemode="contain"/>
                        </div>
                        <Typography  color="textSecondary" gutterBottom>
                            {truncatedName}
                        </Typography>
                        <Typography  color="textSecondary" gutterBottom>
                            {desc}
                        </Typography>
                    </CardContent>
                </Card>
            </GridListTile>
        );
    }
}
