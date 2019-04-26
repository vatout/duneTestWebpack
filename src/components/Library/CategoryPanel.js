import React, { Component } from 'react';
import { Select, MenuItem } from '@material-ui/core';

export default class LibraryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected:[]
        }
    }
    mapTags() {
        var result;
        if (this.props.tags === null || this.props.tags.length === 0)
            return ([]);
        result = this.props.tags.map((value) => {
            return (<MenuItem key={value} value={value}>{value}</MenuItem>)
        });
        return (result);
    }
    handleChange(event) {
        this.setState({selected:event.target.value});
        this.props.onChange(event.target.value);
    }
    clear() {
        this.setState({selected:[]});
        this.props.onChange([]);
    }
    render() {
        const content = this.mapTags();
        return (
            <Select
                value={this.state.selected}
                multiple={true}
                fullWidth={true}
                onChange={(event) => {this.handleChange(event)}}
            >
                {content}
            </Select>
        );
    }
}
