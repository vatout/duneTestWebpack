import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Confetti from 'react-dom-confetti';

const animationStyle = theme => ({
    Animation: {
        position:"fixed",
        width:"100%",
        paddingLeft:"auto",
        paddingRight:"auto",
    },
});

class Animation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animation_input:props.animation,
            active:false,
            displayed:false,
        };
        this.config = {
            angle: 90-45,
            spread: 45,
            startVelocity: 35,
            elementCount: 100,
            decay: 0.9
        };
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.Animation}>
                    <Confetti active={ this.state.active } config={ this.config }/>
            </div>
        );
    }
    componentDidMount() {
        if (this.props.run_at_display === true && this.state.active === false && this.state.displayed === false) {
            this.setState(
                {
                    active:true,
                    displayed:true,
                }
            );
        }
    }
};

export default withStyles(animationStyle)(Animation);
