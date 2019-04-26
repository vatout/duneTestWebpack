import React, { Component } from 'react';
/*
User Interface of the game : contains 4 buttons (one for each player)
props needed are :
 - ref (a ref used by InvacouleurPlate to fetch score and other datas at the end of game and updating info during it)
 - handler (a callback used to notice InvacouleurPlate that a button have been clicked)
 - dictionnary (object containing colors both in hex and string format. ex: red -> 0xff0000)
 - studentList (Array)
*/
export default class InvacouleurInterface extends Component {
    constructor(props) {
        super(props);
        this.setStyle(
            this.props.dictionnary[0].value,
            this.props.dictionnary[1].value,
            this.props.dictionnary[2].value,
            this.props.dictionnary[3].value,
        );
        this.buttonsData = [
            { student: this.props.studentList[0], color: this.props.dictionnary[0].key, score: 0, hit: 0, topScore: 0, lastScore: 0 },
            { student: this.props.studentList[1], color: this.props.dictionnary[1].key, score: 0, hit: 0, topScore: 0, lastScore: 0 },
            { student: this.props.studentList[2], color: this.props.dictionnary[2].key, score: 0, hit: 0, topScore: 0, lastScore: 0 },
            { student: this.props.studentList[3], color: this.props.dictionnary[3].key, score: 0, hit: 0, topScore: 0, lastScore: 0 },
        ];
    }
    /*
    Called by InvacouleurPlate to calculate scores
    */
    getButtonsData = () => {
        var bd = this.buttonsData;
        var result = [
            bd[0],
            bd[1],
            bd[2],
            bd[3]
        ];
        return (result);
    }
    /*
    Called by InvacouleurPlate after updating the grid
    */
    increaseScore = (color, score_to_add) => {
        this.buttonsData.forEach((elem) => {
            if (elem.color === color) {
                elem.score = elem.score + score_to_add;
                if (score_to_add > elem.topScore) {
                    elem.topScore = score_to_add;
                }
                elem.lastScore = score_to_add;
            }
        }, color, score_to_add);
    }
    setButtonStyle(transform, color, left, bottom, right) {
        return ({
            transform: transform,
            borderRadius: "10%",
            borderStyle: "solid",
            borderWidth: "5px",
            position: "fixed",
            padding: "8px",
            width: "80px",
            height: "80px",
            borderColor: color,
            left: left,
            bottom: bottom,
            right: right,
        });
    }
    setStyle(color1, color2, color3, color4) {
        this.interfaceStyle = {
            position: "fixed",
            top: "0",
            left: "0",
            padding: "8px",
        };
        this.button1Style = this.setButtonStyle("rotate(90deg)", color1, "16px", "30%", "");
        this.button2Style = this.setButtonStyle("rotate(1deg)", color2, "20%", "16px", "");
        this.button3Style = this.setButtonStyle("rotate(-1deg)", color3, "", "16px", "20%");
        this.button4Style = this.setButtonStyle("rotate(-90deg)", color4, "", "30%", "16px");
    }
    getButtonsLabels() {
        if (this.buttonsData == null) { // if there is no data, return 4 empty strings so the buttons can be generated properly
            return (["", "", "", ""]);
        }
        return ( //return an array of size 4 containing each student's label (name and firstname). If a label is null, it is replaced by an empty String.
            this.buttonsData.map((value) => {
                return ((value != null && value.student != null) ? value.student.label : "");
            }
            )
        );
    }
    render() {
        var nameTab = this.getButtonsLabels();
        return (
            <div style={this.interfaceStyle}>
                <div style={this.button1Style} onClick={this.button1Clicked}>{nameTab[0]}</div>
                <div style={this.button2Style} onClick={this.button2Clicked}>{nameTab[1]}</div>
                <div style={this.button3Style} onClick={this.button3Clicked}>{nameTab[2]}</div>
                <div style={this.button4Style} onClick={this.button4Clicked}>{nameTab[3]}</div>
            </div>
        );
    }
    button1Clicked = () => {
        this.buttonsData[0].hit += this.props.handler(this.buttonsData[0].color);
    }
    button2Clicked = () => {
        this.buttonsData[1].hit += this.props.handler(this.buttonsData[1].color);
    }
    button3Clicked = () => {
        this.buttonsData[2].hit += this.props.handler(this.buttonsData[2].color);
    }
    button4Clicked = () => {
        this.buttonsData[3].hit += this.props.handler(this.buttonsData[3].color);
    }
}