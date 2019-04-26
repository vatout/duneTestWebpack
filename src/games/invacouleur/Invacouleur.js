import React from 'react';
import { Redirect } from 'react-router-dom';

import { Theme } from '../../utils/Theme';

import InvacouleurErrorDialog from './InvacouleurErrorDialog';
import InstructionDialog from './InvacouleurInstructionDialog';
import InvacouleurPlate from './InvacouleurPlate';
import Activity from '../Activity';

/*
Non graphical object, used to record the time spent playing at the game
*/
const Chrono = {
    time: null,
    lastTime: null,
    start() {
        this.time = new Date();
    },
    stop() {
        var all_time = this.time;
        this.time = null;
        this.lastTime = null;
        return (new Date(new Date() - all_time));
    },
    getInterval() {
        var lt;
        if (this.lastTime == null) {
            lt = this.time;
        }
        else {
            lt = this.lastTime;
        }
        this.lastTime = new Date();
        return (new Date(this.lastTime - lt));
    },
    isRunning() {
        if (this.time != null) {
            return (true);
        }
        return (false);
    },
}



/*
Main class
Graphically : display Dialogs and InvacouleurPlate
Handle redirections, beginning of activity and set up of input data.
*/
export default class Invacouleur extends Activity {
    constructor(props) {
        super(props);
        this.dictionnary = [
            { id: 0, key: "blue", value: "#216fed" },
            { id: 1, key: "red", value: "#e20b2f" },
            { id: 2, key: "green", value: "#1dc611" },
            { id: 3, key: "orange", value: "#ff9d00" }
        ];
        const mode = props.location.state.mode;
        const students = props.location.state.students
        this.state = {
            redirect: false,
            error: false,
            errorMessage: "",
            mode: mode,
            students: students,
            globalScore: 0,
            studentsScore: null,
            instruction: true,
        };
        this.checkError();
        if (this.state.error === true) {
            this.state.instruction = false;
        }
    }
    checkError() {
        if (this.props.location == null || this.props.location.state == null || this.props.location.state.students.length !== 4) {
            var tmp_state = this.state;
            tmp_state.error = true;
            tmp_state.errorMessage = "Attention : cette activité se joue à 4 personnes.";
            this.setState(tmp_state);
        }
    }
    handleGameEnded = (output) => {
        var tmp_state = this.state;
        tmp_state.redirect = true;
        tmp_state.globalScore = output.globalScore;
        tmp_state.studentsScore = output.studentsScore;
        this.setState(tmp_state);
    }
    handleClickBackError = () => {
        var tmp_state = this.state;
        tmp_state.redirect = true;
        this.setState(tmp_state);
    }
    hideInstruction = () => {
        var tmp_state = this.state;
        tmp_state.instruction = false;
        this.setState(tmp_state);
    }
    startPlaying = () => {
        Chrono.start();
        this.hideInstruction();
    }
    stopChrono = () => {
        return (Chrono.stop());
    }
    render() {
        if (this.state.redirect) {
            const state_to_set = { // data sent to Library page and used by CloseActivityDialog
                globalScore: this.state.globalScore,
                studentsScore: this.state.studentsScore,
                error: this.state.error,
                game_path: this.props.location.game_path,
                id: 0,
                name: "Invacouleur",
            };
            const redirect_object = { pathname: "/library", state: state_to_set, };
            return <Redirect push={true} to={redirect_object} />;
        }
        return (
            <div style={Theme.root}>
                <InvacouleurPlate
                    studentList={this.state.students}
                    dictionnary={this.dictionnary}
                    stopChrono={this.stopChrono}
                    endOfGame={this.handleGameEnded}
                />
                <InvacouleurErrorDialog
                    message={this.state.errorMessage}
                    open={this.state.error}
                    onClose={this.handleClickBackError}
                />
                <InstructionDialog
                    open={this.state.instruction}
                    onClose={this.startPlaying}
                />
            </div>
        );
    }
}
