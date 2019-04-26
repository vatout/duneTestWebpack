import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import { Radio, ListItemText } from '@material-ui/core';

class ActivityModeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: '',
        };
    }
    getResult() {
        return (this.state.selectedValue);
    }
    handleChange = (event) => {
        this.setState({ selectedValue: event.target.value });
    }
    render() {
        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={24}
            >
                <Grid item xs>
                    <Grid justify="center"
                        alignItems="center"
                        direction="column"
                        container>
                        <Grid item xs>
                            <Radio
                                checked={this.state.selectedValue === "training"}
                                onChange={this.handleChange}
                                value="training"
                                aria-label="Entrainement"
                                color="default"
                            />
                        </Grid>
                        <Grid item xs>
                            <ListItemText primary={"Entrainement"} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs>
                    <Grid justify="center"
                        alignItems="center"
                        direction="column"
                        container>
                        <Grid item xs>
                            <Radio
                                checked={this.state.selectedValue === "exercise"}
                                onChange={this.handleChange}
                                value="exercise"
                                aria-label="Exercice"
                                color="default"
                            />
                        </Grid>
                        <Grid item xs>
                            <ListItemText primary={"Exercice"} />

                        </Grid >
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default ActivityModeSelector;