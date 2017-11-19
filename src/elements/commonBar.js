import React, { Component } from 'react';
import {
    View
} from 'react-native';


import HorizontalBar from './horizontalBar';
import VerticalBar from './verticalBar';
import { dealWithOption } from '../chartUtils';

import ToastView from './toastView';

export default class Bar extends React.Component {
    constructor(props) {
        super(props)
        let { height, width } = props.style;
        let viewHeight = height ? height : 300;
        let viewWidth = width ? width : window.width;
        this.state = {
            viewHeight,
            viewWidth,
            interWidth: props.interWidth,
            valueInterval: props.valueInterval,
            stack: props.option.stack,
            ...dealWithOption(viewWidth, viewHeight, props.option, props.valueInterval)
        }
        this.showToastView = this.showToastView.bind(this);
        this.closeToastView = this.closeToastView.bind(this);
    }


    showToastView(showClickIndex, series, location) {
        this.refs.toast.show(showClickIndex, series, location)
    }
    closeToastView() {
        this.refs.toast.hide()
    }

    render() {
        return (
            <View >
                {this.state.horizontal ?
                    < HorizontalBar {...this.state } style={this.props.style} showToastView={this.showToastView} closeToastView={this.closeToastView} /> :
                    < VerticalBar {...this.state } style={this.props.style} showToastView={this.showToastView} closeToastView={this.closeToastView} />}
                <ToastView ref='toast' />
            </View>
        )
    }

}

Bar.defaultProps = {
    option: {
        xAxis: {
            type: 'category',
            // type: 'value',
            data: ['Mon', 'Tue', 'Wed', 'Thusssss', 'Fri', 'Sat', 'Sun', 'wqe', 'sdr', 'opu'],
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            // type: 'category',
            type: 'value',
            data: ['Mon', 'Tue', 'Wed', 'Thusssss', 'Fri', 'Sat', 'Sun', 'wqe', 'sdr', 'opu'],
            axisTick: {
                alignWithLabel: true
            }
        },
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '60%',
                data: [10, 5, 2, 3, 10, 7, 6, 5, 2, 3,]
            },
            {
                name: '非直接访问',
                type: 'bar',
                barWidth: '60%',
                data: [3, 4, 1, 4, 2, 8, 3, 3, 10, 7]
            }
        ],
        stack: false
    },
    valueInterval: 3,
    style: { height: 400, width: window.width },
    interWidth: 10
}