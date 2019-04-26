import React, { Component } from 'react';
//import deburr from 'lodash/deburr';
//import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField/TextField'
//import match from 'autosuggest-highlight/match';
//import parse from 'autosuggest-highlight/parse';
//import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import { Card, Typography, Chip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div>{props.children}</div>;
}

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu(props) {
    return (
        <Paper square {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};


class AutosuggestField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStudentsIds: [],
            suggestionsDictionnary: props.suggestions,
            openedSuggestionList: false,
            choix: null,
        }
        if (this.props.suggestions != null) {
            this.suggestions = this.props.suggestions.map(elem => ({ value: elem, label: elem.label }));
        }
    }
    updateInputList = list => {
        var tmp_state = this.state;
        tmp_state.suggestionsDictionnary = list;
        this.setState(tmp_state);
        this.suggestions = list.map(elem => ({ value: elem, label: elem.label }));
    }
    handleChange = name => value => {
        this.setState({
            [name]: value,
        });
    }
    getList()
    {
        return (this.state.choix);
    }
    render() {
        const { classes } = this.props;
        return (
            <Card>
                <div>
                    <Select
                        ref="listField"
                        classes={classes}
                        textFieldProps={{
                            InputLabelProps: {
                                shrink: true,
                            },
                        }}
                        options={this.suggestions}
                        components={components}
                        value={this.state.choix}
                        onChange={this.handleChange('choix')}
                        placeholder={this.props.placeholder}
                        isMulti
                    />
                </div>
            </Card>
        );
    }
}

export default AutosuggestField;
