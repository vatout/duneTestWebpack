import React, { Component } from 'react';
import { Grid } from '@material-ui/core';

import InvacouleurInterface from './InvacouleurInterface';
import PlateCase from './PlateCase';

/*
Graphically : Grid displaying the state of the game.
Also check if the game is done and generate score at the end
props needed are :
 - studentList (Array)
 - dictionnary (object containing colors both in hex and string format. ex: red -> 0xff0000)
 - endOfGame (callback to use at the end of the game to return scores and redirect to menu)
*/
export default class InvacouleurPlate extends Component {
    constructor(props) {
        super(props);
        this.size = 15;
        this.ColorDictionnary = this.props.dictionnary;
        this.InvacouleurPlateStyle = {
            margin: "auto",
            position: "absolute",
            width: "70%",
            height: "99vh",
            marginLeft: "15%",
            padding: "8px",
            textAlign: "center",
            display: "table-cell",
            verticalAlign: "middle",
        };
        this.InvacouleurPlateLineStyle = {
            margin: "auto",
            position: "static",
            width: "fit-content",
            verticalAlign: "middle",
        };
        this.state = {
            plate: this.createPlate(this.size, this.size),
            currentColor: null,
        }
        this.changedColor(this.state.plate[Math.floor(this.size / 2)][Math.floor(this.size / 2)].value);
        this.interfaceRef = React.createRef();
    }
    /*
    Init the grid to random values
    */
    createPlate(x, y) {
        var result = [];
        for (var i = 0; i < y; ++i) {
            var tmpline = [];
            for (var j = 0; j < x; ++j) {
                var random_index = Math.floor(Math.random() * this.ColorDictionnary.length)
                tmpline.push(
                    {
                        x: j,
                        y: i,
                        value: this.ColorDictionnary[random_index].key,
                        linked: false,
                    }
                );
            }
            result.push(tmpline);
        }
        result[Math.floor(y / 2)][Math.floor(x / 2)].linked = true;
        return (result);
    }
    /*
    Used in render() method
    */
    renderPlate() {
        var content = [];
        const dictionnary = this.ColorDictionnary;
        const lineStyle = this.InvacouleurPlateLineStyle;
        this.state.plate.forEach(element => {
            content.push(
                <Grid container alignContent='center' style={lineStyle}>
                    {element.map(subelem => {
                        var color;
                        dictionnary.forEach(d_value => {
                            if (d_value.key === subelem.value) {
                                color = d_value.value;
                            }
                        }, subelem, color);
                        return (
                            <Grid item>
                                <PlateCase color={color} linked={subelem.linked} />
                            </Grid>
                        );
                    }, dictionnary, lineStyle)}
                </Grid>
            );
        }, content, dictionnary);
        return (
            content
        );

    }
    /*
    Launched when a button of InvacouleurInterface have been clicked and after making sure that this said
    color isn't the same that the one already selected (to avoid double-tap).
    */
    changedColor(color) {
        var tmp_plate = this.state.plate;
        var prev_left = this.countLeft(tmp_plate);
        tmp_plate = this.updatePlateColors(tmp_plate, color);
        var curstate = this.state;
        curstate.plate = tmp_plate;
        curstate.currentColor = color;
        this.setState(curstate);
        if (this.interfaceRef != null) { // this is null at "turn 0" (when nobody played but some links are to be made)
            this.interfaceRef.current.increaseScore(color, prev_left - this.countLeft(tmp_plate));
            // increase individual score (of associated color . player), of the number of link made on this turn
        }
        this.lookUpForVictory();
    }
    /*
    Calculate the global score of the team
    GlobalScore = 100 * sum of the score of every buttons
    */
    calculateScore(buttonData, totalTime) {
        var total_hits = 0;
        var total_score = 0;
        buttonData.forEach((elem) => {
            total_hits += elem.hit;
            total_score += elem.score;
        }, total_hits, total_score);
        const timeInSecond = totalTime.getSeconds() + totalTime.getMinutes() * 60;
        const result = 100 * total_score / (total_hits * timeInSecond);
        return (result);
    }
    /*
    Calculate the score of each player
    */
    calculateIndividualScore(buttonData, globalScore) {
        var result = [];
        buttonData.forEach(
            (button) => {
                const hit = (button.hit === 0) ? 1 : button.hit;
                const score = globalScore * (button.score / hit);
                result.push({
                    student: button.student,
                    score: score,
                    medals: [],
                });
            }
            , globalScore, result);
        return (result);
    }
    /*
    Setup the medals delivered to students according to their scores and stats
    Current medals : 
     - Best score
     - Best hit (best score on a single hit)
     - Best last hit (largest amount of points on the last hit -> try to avoid to leave a single cell of your color)
    */
    updateMedals(scores, buttonData) {
        var index_best_score = 0;
        var index_best_score_on_one_turn = 0;
        var index_best_last_score = 0;
        for (var i = 0; i < scores.length; ++i) {
            if (scores[i].score > scores[index_best_score].score) {
                index_best_score = i;
            }
            if (buttonData[i].topScore > buttonData[index_best_score_on_one_turn].topScore) {
                index_best_score_on_one_turn = i;
            }
            if (buttonData[i].lastScore > buttonData[index_best_last_score].lastScore) {
                index_best_last_score = i;
            }
        }
        scores[index_best_score].medals.push({ label: "Meilleur Score" });
        scores[index_best_score_on_one_turn].medals.push({ label: "Meilleur coup" });
        scores[index_best_last_score].medals.push({ label: "Meilleur dernier coup" });
        return (scores);
    }
    lookUpForVictory() {
        if (this.countLeft(this.state.plate) === 0) {
            var output = {};
            var buttonData = this.interfaceRef.current.getButtonsData();
            output.globalScore = this.calculateScore(buttonData, this.props.stopChrono());
            output.studentsScore = this.calculateIndividualScore(buttonData, output.globalScore);
            output.studentsScore = this.updateMedals(output.studentsScore, buttonData);
            this.props.endOfGame(output);
        }
    }
    countLeft(plate) {
        var result = 0;
        plate.forEach(line => {
            line.forEach(elem => {
                if (elem.linked === false) {
                    result = result + 1;
                }
            }, result)
        }, result);
        return (result);
    }
    shouldBeLinked(here, plate, currentColor) {
        if (here.value !== currentColor || here.linked === true) {
            return (false)
        }
        const x = here.x;
        const y = here.y
        if (x > 0 && plate[y][x - 1].linked === true) {
            return (true);
        }
        if (x !== (plate[y].length - 1) && plate[y][x + 1].linked === true) {
            return (true);
        }
        if (y > 0 && plate[y - 1][x].linked === true) {
            return (true);
        }
        if (y !== (plate.length - 1) && plate[y + 1][x].linked === true) {
            return (true);
        }
        return (false);
    }
    updatePlateColors(plate, color) {
        const max = this.countLeft(plate);
        var current_case;
        for (var c = 0; c < max; ++c) {
            for (var i = 0; i < plate.length; ++i) {
                for (var j = 0; j < plate[i].length; ++j) {
                    current_case = plate[i][j];
                    if (this.shouldBeLinked(current_case, plate, color)) {
                        current_case.linked = true;
                        plate[i][j] = current_case;
                    }
                }
            }
        }
        for (i = 0; i < plate.length; ++i) {
            for (j = 0; j < plate[i].length; ++j) {
                if (plate[i][j].linked) {
                    plate[i][j].value = color;
                }
            }
        }
        return (plate);
    }
    handleButtonClicked = (value) => {
        if (this.state.currentColor === value) {
            return (0);
        }
        this.changedColor(value);
        return (1);
    }
    render() {
        var plate = this.renderPlate();
        return (
            <div style={this.InvacouleurPlateStyle} alignContent='center'>
                {plate}
                <InvacouleurInterface ref={this.interfaceRef} handler={this.handleButtonClicked} dictionnary={this.ColorDictionnary} studentList={this.props.studentList} />
            </div>
        );
    }
}