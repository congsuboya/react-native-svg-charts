import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Animated,
    Dimensions,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native';

import Svg, {
    Line,
    Circle,
    G,
    Path,
    Rect,
    LinearGradient,
    Stop,
    Defs,
    Text as SvgText
} from 'react-native-svg';

import { DrawXYAxisLine, dealWithOption, DrawYXAxisValue, DrawYValueView } from '../chartUtils';

import ToastView from './toastView';

const window = Dimensions.get('window');
import ColorList from '../globalVariable';
const AnimatedRect = Animated.createAnimatedComponent(Rect);
export default class LineChart extends React.Component {


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
            selectIndex: -1,
            ...dealWithOption(viewWidth, viewHeight, props.option, props.valueInterval, true)
        }
        this.clickChart = this.clickChart.bind(this);
    }

    renderBarItem() {
        let {
             series,
            rectWidth,
            perRectHeight,
            barCanvasHeight,
            interWidth,
            selectIndex,
            svgHeight
        } = this.state;

        let lineViewList = [];
        let pointViewList = [];
        let pointInterWidth = interWidth * 2 + rectWidth;
        let initX = interWidth + rectWidth / 2, pointY;
        let dStr;
        series.map((mapItem, index) => {
            mapItem.data.map((innerItem, innerIndex) => {
                initX = interWidth + rectWidth / 2 + innerIndex * pointInterWidth;
                pointY = innerItem * perRectHeight;
                if (innerIndex == 0) {
                    dStr = `M${initX} ${pointY}`;
                } else {
                    dStr = `${dStr} L${initX} ${pointY}`;
                }
                if (selectIndex == innerIndex) {
                    pointViewList.push(<Circle cx={initX} cy={pointY} r="2.5" fill={ColorList[index]} />)
                }
            });
            lineViewList.push(<Path d={dStr} strokeWidth='1' stroke={ColorList[index]} fill='none' />)
        });
        if (pointViewList.length > 0 && selectIndex > -1) {
            pointViewList.push(<Line key='selectedLine'
                x1={interWidth + rectWidth / 2 + selectIndex * pointInterWidth}
                y1={10}
                x2={interWidth + rectWidth / 2 + selectIndex * pointInterWidth}
                y2={svgHeight}
                stroke="url(#grad)"
                strokeWidth='1' />)
        }

        return lineViewList.concat(pointViewList);
    }

    clickChart(location) {
        let {
            rectWidth,
            interWidth,
            series
       } = this.state;

        let pointInterWidth = interWidth * 2 + rectWidth;
        let clickItemIndex = parseInt(location.locationX / pointInterWidth);
        let newLocation = Object.assign(location, { locationX: location.pageX })
        this.refs.toast.show(clickItemIndex, series, location)
        if (this.state.selectIndex !== clickItemIndex) {
            this.setState({
                selectIndex: clickItemIndex
            })
        }
    }

    render() {
        let { maxNum, series, xAxis, valueInterval,
            viewWidth, viewHeight, svgHeight, svgWidth,
            barCanvasHeight, perRectHeight, rectWidth, rectNum, interWidth
            } = this.state;
        return (
            <View style={[{ flexDirection: 'row' }, this.props.style]}>
                {DrawYValueView(valueInterval, barCanvasHeight, viewHeight, maxNum)}
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                    showsVerticalScrollIndicator={false}
                    style={{ height: viewHeight, width: viewWidth - 50 }}
                    onScroll={() => {
                        this.refs.toast.hide();
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: 'white', height: viewHeight, width: svgWidth }}>
                        <View style={{ flex: 0, backgroundColor: 'white' }}>
                            < Svg width={svgWidth} height={svgHeight}>
                                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2={svgHeight - 10}>
                                    <Stop offset="0" stopColor="#228EE6" stopOpacity="1" />
                                    <Stop offset="1" stopColor="#3AE8CB" stopOpacity="0.11" />
                                </LinearGradient>
                                {DrawXYAxisLine(barCanvasHeight, svgWidth, true, valueInterval)}
                                {this.renderBarItem()}
                            </Svg>
                        </View>
                        <TouchableWithoutFeedback
                            onPress={(e) => this.clickChart(e.nativeEvent)} >
                            <View style={{ width: svgWidth, height: svgHeight - 10, position: 'absolute', top: 10, right: 0, flexDirection: 'row' }} />
                        </TouchableWithoutFeedback>
                        {DrawYXAxisValue(xAxis, true, svgWidth, rectWidth * rectNum + 2 * interWidth)}
                    </View>
                </ScrollView >

                <Text style={{
                    color: '#8FA1B2',
                    fontSize: 9,
                    height: 20,
                    marginTop: 5,
                    width: 100,
                    position: 'absolute',
                    textAlign: 'center',
                    bottom: -7,
                    right: (viewWidth - 135) / 2
                }}> x轴名称</Text >
                <ToastView ref='toast' />
            </View >
        )
    }
}

LineChart.defaultProps = {
    option: {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thusssss', 'Fri', 'Sat', 'opu', 'Sun', 'wqe', 'sdr', 'opu', 'Sat', 'Sun', 'wqe', 'sdr', 'opu'],
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            data: ['Mon', 'Tue', 'Wed', 'Thusssss', 'Fri', 'Sat', 'Sun', 'wqe', 'sdr', 'opu'],
            axisTick: {
                alignWithLabel: true
            }
        },
        series: [
            {
                name: '直接访问',
                type: 'line',
                barWidth: '60%',
                data: [10, 5, 2, 3, 10, 7, 6, 5, 2, 3, 10, 7, 6, 5, 2, 3]
            },
            {
                name: '非直接访问',
                type: 'line',
                barWidth: '60%',
                data: [3, 4, 1, 4, 2, 8, 3, 3, 10, 7, 3, 3, 10, 7, 8, 3]
            }
        ],
        stack: false
    },
    valueInterval: 3,
    style: { height: 400, width: window.width },
    interWidth: 10
}