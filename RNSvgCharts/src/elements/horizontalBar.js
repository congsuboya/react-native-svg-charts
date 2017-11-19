import React, { Component } from 'react';
import {
    Dimensions,
    View,
    Animated,
    ScrollView,
    Text,
    TouchableHighlight
} from 'react-native';

import Svg, {
    Circle,
    Path,
    Rect,
    G,
    TSpan,
    Text as SvgText
} from 'react-native-svg';
const window = Dimensions.get('window');
import ColorList from '../globalVariable';

import { DrawXYAxisLine, dealWithOption, DrawYXAxisValue, DrawYValueView } from '../chartUtils';
const AnimatedRect = Animated.createAnimatedComponent(Rect);


export default class HorizontalBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ...props
        }
        this.viewAnimatedList = [];
        this.renderBarItem = this.renderBarItem.bind(this);
        this.clickItemView = this.clickItemView.bind(this);
        this.scrollOffX = 0;
    }


    renderBarItem() {
        let {
            maxNum, series,
            intervalNum,
            rectNum,
            rectWidth,
            perRectHeight,
            barCanvasHeight,
            interWidth,
            stack
        } = this.state;

        let barViewList = [];
        let rectHight;
        let xNum;
        let numlength;
        let textX;
        let textY;
        let textColor;
        let rotateY;
        let preTextWidth = 3;

        for (let i = 0; i < intervalNum; i++) {

            let lastHeight = 0;
            series.map((mapItem, index) => {
                rectHight = mapItem.data[i] * perRectHeight;
                if (rectHight < 2) {
                    rectHight = 2;
                }

                xNum = (i * 2 + 1) * interWidth + i * rectWidth * rectNum;

                if (!stack) {
                    xNum = xNum + index * rectWidth;
                }
                barViewList.push(
                    <AnimatedRect
                        key={index + 'horizontalRect'}
                        x={xNum}
                        y={barCanvasHeight + 10 - lastHeight}
                        width={rectWidth}
                        height={-rectHight}
                        fill={ColorList[index]}
                    />
                );
                if (stack) {
                    lastHeight = rectHight + lastHeight;
                } else {
                    lastHeight = rectHight;
                }

                numlength = mapItem.data[i].toString().length;
                textX = xNum + rectWidth / 2 - 1;
                textY = barCanvasHeight + 15 - lastHeight + numlength * preTextWidth / 2;
                textColor = 'white';
                if (numlength * 10 > rectHight) {
                    textY = barCanvasHeight + 10 - lastHeight - numlength * preTextWidth / 2;
                    textColor = 'black';
                }

                if (!stack) {
                    lastHeight = 0;
                }
                barViewList.push(
                    <G key={index + 'horizontalBar'} rotate="90" origin={`${textX},${textY - 3}`} >
                        < SvgText
                            fill={textColor}
                            x={textX}
                            y={textY}
                            fontSize="10"
                            textAnchor="middle">{mapItem.data[i]}</SvgText >
                    </G>
                )
            })
        }
        return barViewList;
    }

    clickItemView(i, clickAreWidth, location) {
        let { series } = this.state;
        let newLocation = Object.assign(location, { locationX: (i * clickAreWidth - this.scrollOffX + location.locationX + 40) })
        this.props.showToastView(i, series, newLocation);
    }
    renderClickItemView() {
        let { intervalNum, rectWidth, rectNum, interWidth, svgWidth, svgHeight, series } = this.state;
        let clickViewList = [];
        for (let i = 0; i < intervalNum; i++) {
            let clickAreWidth = (rectWidth * rectNum + interWidth * 2);
            clickViewList.push(
                <TouchableHighlight
                    key={i + 'clickItem'}
                    underlayColor='rgba(34,142,230,0.10)'
                    onPressIn={(e) => this.clickItemView(i, clickAreWidth, e.nativeEvent)}>
                    <View style={{ width: clickAreWidth, height: svgHeight - 10 }} />
                </TouchableHighlight>
            )
        };
        return clickViewList;
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
                    onMomentumScrollEnd={(e) => {
                        if (viewWidth - 50 < svgWidth) {
                            this.scrollOffX = e.nativeEvent.contentOffset.x;
                        }
                    }}
                    onScroll={(e) => {
                        this.props.closeToastView();
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: 'white', height: viewHeight, width: svgWidth }}>
                        <View style={{ flex: 0, backgroundColor: 'white' }}>
                            < Svg width={svgWidth} height={svgHeight}>
                                {DrawXYAxisLine(barCanvasHeight, svgWidth, true, valueInterval)}
                                {this.renderBarItem()}
                            </Svg>
                        </View>
                        <View style={{ width: svgWidth, height: svgHeight, position: 'absolute', top: 10, right: 0, flexDirection: 'row' }}>
                            {this.renderClickItemView()}
                        </View>

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
            </View >
        )
    }
}


