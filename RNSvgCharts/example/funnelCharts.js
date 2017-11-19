import React, { Component } from 'react';
import {
    View,
    TextInput,
    Button,
    Slider,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

import { Funnel } from '../src';

export default class LineCharts extends React.Component {

    static navigationOptions = {
        title: '漏斗图',
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [100, 120, 70],
            yMax: 200
        }
    }

    rnd(n, m) {
        return Math.floor(Math.random() * (m - n + 1) + n);
    }

    produceData() {
        let data = [];
        let num = Math.floor(Math.random() * (4) + 3);
        for (let i = 0; i < num; i++) {
            data.push(this.rnd(10, 200));
        }
        return data;
    }

    render() {
        let { data, yMax } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Funnel style={{ height: 230, width: width }} />
                <View style={{ width: 100 }}>
                    <Button
                        style={{ width: 100 }}
                        onPress={() => {
                            let datas = this.produceData();
                            this.setState({
                                data: datas,
                            })
                        }}
                        title="重置"
                    />
                </View>
            </View>
        )
    }
}