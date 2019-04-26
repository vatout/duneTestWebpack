import React, {Component} from 'react';
import SketchPad from './SketchPad';
import {TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE} from './tools';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    padStyle: {
        borderRadius: '1%',
        backgroundColor: "white",
        border: '2px solid #e49078',
        margin: '2%'
    }
});

class BoardContent extends Component {
  socket = null;

  constructor(props) {
    super(props);

    this.state = {
      tool: TOOL_PENCIL,
      size: 2,
      color: '#000000',
      fill: false,
      fillColor: '#0000ff',
      items: [],
        gridSetup: 6
    }
  }

  handleEllipse = () => {
      this.setState({tool: TOOL_ELLIPSE});
      this.setState({gridSetup: 4});
  }

  render() {
    const {
      tool,
      size,
      color,
      fill,
      fillColor,
      items
    } = this.state;

    const {classes} = this.props;

    return (

        <div className={classes.root}>

        <Grid container
          spacing={0}
          alignItems="flex-start"
          justify="flex-start"
          style={{ minHeight: '0vh' }}>

          <Button>
            <Link to="/blackboard">
              <img src={require("../../../assets/logo_back.png")} alt="back"></img>
            </Link>
          </Button>
          </Grid>
            <Grid container={true} spacing={12} direction={'row'}>

                <Grid item lg={12} style={{margin:'0'}}>
                      <div className={classes.padStyle}>
                          <SketchPad  width={window.innerWidth * 0.95} height={window.innerHeight * 0.7} animate={true} size={size} color={color} fillColor={fill
                              ? fillColor
                              : ''} items={items} tool={tool}/>

                      </div>
                </Grid>

                <Grid container item lg={12} style={{textAlign: 'center'}}>
                    <Grid container item lg={6} style={{textAlign: 'center', margin: '0 auto', padding: '0%'}}>
                        <Grid item lg={3}>
                              <Button color="secondary" size="large" style={tool === TOOL_PENCIL
                                  ? {
                                      fontWeight: 'bold'
                                  }
                                  : undefined} className={tool === TOOL_PENCIL
                                  ? 'item-active'
                                  : 'item'} onClick={() => this.setState({tool: TOOL_PENCIL})}>Pencil
                              </Button>
                        </Grid>
                        <Grid item  lg={3}>
                              <Button color="secondary" size="large" style={tool === TOOL_LINE
                                  ? {
                                      fontWeight: 'bold'
                                  }
                                  : undefined} className={tool === TOOL_LINE
                                  ? 'item-active'
                                  : 'item'} onClick={() => this.setState({tool: TOOL_LINE})}>Line
                              </Button>
                        </Grid>
                        <Grid item  lg={3}>
                              <Button color="secondary" size="large" style={tool === TOOL_ELLIPSE
                                  ? {
                                      fontWeight: 'bold'
                                  }
                                  : undefined} className={tool === TOOL_ELLIPSE
                                  ? 'item-active'
                                  : 'item'} onClick={this.handleEllipse}>Ellipse
                              </Button>
                        </Grid>
                        <Grid item  lg={3}>
                              <Button color="secondary" size="large" style={tool === TOOL_RECTANGLE
                                  ? {
                                      fontWeight: 'bold'
                                  }
                                  : undefined} className={tool === TOOL_RECTANGLE
                                  ? 'item-active'
                                  : 'item'} onClick={() => this.setState({tool: TOOL_RECTANGLE})}>Rectangle
                              </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container item lg={12} style={{textAlign: 'center'}} direction={'row'}>
                    <Grid container item lg={6} style={{textAlign: 'center', margin: '0 auto'}}>

                        <Grid item  lg={this.state.gridSetup}>
                            <div className="options" style={{
                                marginBottom: 20
                            }}>
                                <label htmlFor="">Taille:<br/>
                                </label>
                                <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({
                                    size: parseInt(e.target.value)
                                })}/>
                            </div>
                        </Grid>
                        <Grid item  lg={this.state.gridSetup}>
                            <div className="options" style={{
                                marginBottom: 20
                            }}>
                                <label htmlFor="">Couleur:<br/>
                                </label>
                                <input type="color" value={color} onChange={(e) => this.setState({color: e.target.value})}/>
                            </div>
                        </Grid>
                        <Grid item  lg={this.state.gridSetup}>
                            {
                                (this.state.tool === TOOL_ELLIPSE || this.state.tool === TOOL_RECTANGLE)
                                    ? <div>
                                        <label htmlFor="">Remplir la forme:</label>
                                        <input type="checkbox" value={fill} style={{
                                            margin: '0 8'
                                        }} onChange={(e) => this.setState({fill: e.target.checked})}/> {
                                        fill
                                            ? <span>
                                            <label htmlFor="">Avec la couleur:</label>
                                            <input type="color" value={fillColor} onChange={(e) => this.setState({fillColor: e.target.value})}/>
                                          </span>
                                            : ''
                                    }
                                    </div>
                                    : ''
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
  }
}

BoardContent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BoardContent);
