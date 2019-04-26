import React, { Component } from 'react';

/*
Represent a case of the plate
Contains no information, purely graphical
*/
export default class PlateCase extends Component {
    render() {
        var style; // is a square if it's linked, otherwise, is round
        if (this.props.linked === true) {
            style = {
                backgroundColor: this.props.color,
                width: "5vh",
                height: "5vh",
            }
        }
        else {
            style = {
                borderRadius: "50%",
                backgroundColor: this.props.color,
                width: "5vh",
                height: "5vh",
            }
        }
        return (
            <div style={style}></div>
        );
    }
}