import React, { Component } from 'react';
import {
    View,
    TextInput,
    Button,
    Slider,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

import { Pie } from '../src';


export default class PieCharts extends React.Component {

    static navigationOptions = {
        title: '饼图',
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [10, 30, 70],
            pieR: 100
        }
    }

    render() {
        let { data, pieR } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Pie style={{ height: 230, width: width }} />
            </View>
        )
    }
}