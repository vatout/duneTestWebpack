import React, { Component } from 'react';

import { Dialog, DialogTitle, DialogContent, Card, Button, Slide, DialogActions, CardContent, CardHeader } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import illustration1 from './assets/00.png';
import illustration2 from './assets/01.png';
import illustration3 from './assets/02.png';
import illustration4 from './assets/03.png';

/*
Dialog printed at the start of the game : display 4 slides to explain how to play
*/
export default class InstructionDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
        };
    }
    // prevPage and nextPage can't lead to an overflow because nextButton and prevButton are disabled when the index (page) reach a limit
    /*
    Decrease the index of the displayed page
    */
    prevPage = () => {
        var prev_state = this.state;
        prev_state.page -= 1;
        this.setState(prev_state);
    }
    /*
    Increase the index of the displayed page
    */
    nextPage = () => {
        var prev_state = this.state;
        prev_state.page += 1;
        this.setState(prev_state);
    }
    render() {
        const illustrationStyle = {
            width: "100%",
        };
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose}>
                <DialogTitle>
                    Invacouleur
                </DialogTitle>
                <DialogContent>
                    <Slide direction='right' in={(this.state.page === 0) ? true : false} mountOnEnter unmountOnExit>
                        <Card>
                            <CardHeader title="Comment jouer ?" />
                            <CardContent>
                                <Typography align='center'>
                                    Dans InvaCouleur, vous allez devoir coopérer pour gagner !
                                </Typography>
                                <Typography align='center'>
                                    Votre objectif est de conquérir tout le plateau.
                                </Typography>
                                <Typography align='center'>
                                    Vous partez du carré central...
                                </Typography>
                            </CardContent>
                            <img src={illustration1} style={illustrationStyle} alt="Victor Corrige ça stp" />
                        </Card>
                    </Slide>
                    <Slide direction='right' in={(this.state.page === 1) ? true : false} mountOnEnter unmountOnExit>
                        <Card>
                            <CardHeader title="Comment jouer ?" />
                            <CardContent>
                                <Typography align='center'>
                                    Chacun d'entre vous se voit attitrer un bouton,
                                </Typography>
                                <Typography align='center'>
                                    avec lequel il pourra contrôler une couleur.
                                </Typography>
                            </CardContent>
                            <img src={illustration2} style={illustrationStyle} alt="Victor Corrige ça stp" />
                        </Card>
                    </Slide>
                    <Slide direction='right' in={(this.state.page === 2) ? true : false} mountOnEnter unmountOnExit>
                        <Card>
                            <CardHeader title="Comment jouer ?" />

                            <CardContent>
                                <Typography align='center'>
                                    Lorsqu'un joueur appuie sur son bouton,
                                </Typography>
                                <Typography align='center'>
                                    le carré prend cette couleur,
                                </Typography>
                                <Typography align='center'>
                                    et s'étale sur les bulles adjacentes de la même couleur.
                                </Typography>
                            </CardContent>
                            <img src={illustration3} style={illustrationStyle} alt="Victor Corrige ça stp" />
                        </Card>
                    </Slide>
                    <Slide direction='right' in={(this.state.page === 3) ? true : false} mountOnEnter unmountOnExit>
                        <Card>
                            <CardHeader title="Comment jouer ?" />

                            <CardContent>
                                <Typography align='center'>
                                    La partie est terminée quand tous les ronds ont été conquis.
                                </Typography>
                                <Typography align='center'>
                                    Essayez de conquérir toutes les bulles en un minimum de coups,
                                </Typography>
                                <Typography align='center'>
                                    et le plus vite possible.
                                </Typography>
                            </CardContent>
                            <img src={illustration4} style={illustrationStyle} alt="Victor Corrige ça stp" />
                        </Card>
                    </Slide>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>Commencer</Button>
                    <Button disabled={(this.state.page === 0) ? true : false} onClick={this.prevPage}>Précédent</Button>
                    <Button disabled={(this.state.page === 3) ? true : false} onClick={this.nextPage}>Suivant</Button>
                </DialogActions>
            </Dialog>
        );
    }
}
