import React, { Component } from 'react';

import BoardContent from './canva/BoardContent';

import { Theme } from '../../utils/Theme';

export default class Paint extends Component {

  render() {
    return (
      <div style={Theme.root}>
        <BoardContent style={{flexGrow: 1}}/>
        </div>
      );
    }
  }
