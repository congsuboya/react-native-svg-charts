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
    Text as SvgText
} from 'react-native-svg';
const window = Dimensions.get('window');
import ColorList from '../globalVariable';

import { DrawXYAxisLine, DrawYXAxisValue, DrawXValueView } from '../chartUtils';
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default class VerticalBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ...props
        }
        this.viewAnimatedList = [];
        this.renderBarItem = this.renderBarItem.bind(this);
        this.renderClickItemView = this.renderClickItemView.bind(this);
        this.clickItemView = this.clickItemView.bind(this);
        this.scrollOffY = 0;
    }


    renderBarItem() {
        let {
            maxNum, series,
            intervalNum,
            rectNum,
            rectWidth,
            perRectHeight,
            barCanvasHeight,
            horizontal,
            interWidth,
            stack
        } = this.state;

        let barViewList = [];
        let rectHight;
        let yNum;
        let numlength;

        let lastWidth = 0;;
        let lastHeight = 0;
        let nowWidth = 0;
        let nowHeight = 0;

        for (let i = 0; i < intervalNum; i++) {
            let lastWidth = 0;
            series.map((mapItem, index) => {
                rectHight = mapItem.data[i] * perRectHeight;
                if (rectHight < 20) {
                    rectHight = 20;
                }

                yNum = (i * 2 + 1) * interWidth + i * rectWidth * rectNum;

                if (!stack) {
                    yNum = yNum + index * rectWidth;
                }

                barViewList.push(
                    <AnimatedRect
                        key={index + 'verticalRect'}
                        x={2 + lastWidth}
                        y={yNum}
                        width={rectHight}
                        height={rectWidth}
                        fill={ColorList[index]}
                    />
                );

                if (stack) {
                    lastWidth = rectHight + lastWidth;
                } else {
                    lastWidth = rectHight;
                }

                numlength = mapItem.data[i].toString().length;
                if (numlength * 10 > rectHight) {
                    barViewList.push(< SvgText key={index + 'verticalText'} x={lastWidth + 3} y={yNum + (rectWidth + 8) / 2} fontSize="10" textAnchor="start">{mapItem.data[i]}</SvgText >)
                } else {
                    barViewList.push(< SvgText key={index + 'verticalText'} fill="white" x={lastWidth - 3} y={yNum + (rectWidth + 8) / 2} fontSize="10" textAnchor="end">{mapItem.data[i]}</SvgText >)
                }

                if (!stack) {
                    lastWidth = 0;
                }

            })
        }
        return barViewList;
    }

    clickItemView(i, clickAreHeight, location) {
        let { series } = this.state;
        let newLocation = Object.assign(location, { locationY: (i * clickAreHeight - this.scrollOffY + location.locationY + 10) }, { locationX: location.locationX + 50 })
        this.props.showToastView(i, series, newLocation);
    }

    renderClickItemView() {
        let { intervalNum, rectWidth, rectNum, interWidth, svgWidth, series } = this.state;
        let clickViewList = [];
        let clickAreHeight
        for (let i = 0; i < intervalNum; i++) {
            clickAreHeight = (rectWidth * rectNum + interWidth * 2);
            clickViewList.push(
                <TouchableHighlight
                    key={i + 'clickItem'}
                    underlayColor='rgba(34,142,230,0.10)'
                    onPressIn={(e) => this.clickItemView(i, clickAreHeight, e.nativeEvent)}>
                    <View style={{ width: svgWidth, height: clickAreHeight }} />
                </TouchableHighlight>
            )
        };
        return clickViewList;
    }

    render() {
        let { maxNum, series, xAxis, yAxis, valueInterval, intervalNum,
            viewWidth, viewHeight, svgHeight, svgWidth,
            barCanvasHeight, perRectHeight, rectWidth, rectNum, interWidth
            } = this.state;
        return (
            < View style={[{ flexDirection: 'row', backgroundColor: 'white' }, this.props.style]} >
                <Text style={{
                    fontSize: 9,
                    width: 10,
                    height: 100,
                    textAlign: 'center',
                    marginTop: (viewHeight - 135) / 2,
                    marginLeft: 5,
                    marginRight: 5
                }}>y轴名称</Text>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <ScrollView
                        horizontal={false}
                        style={{ height: viewHeight - 35, width: viewWidth - 20 }}
                        showsVerticalScrollIndicator={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            if (viewHeight - 35 < svgHeight) {
                                this.scrollOffY = e.nativeEvent.contentOffset.y;
                            }
                            this.props.closeToastView();
                        }}
                        onMomentumScrollEnd={(e) => {
                        }}
                    >
                        <View style={{ width: viewWidth - 20, height: svgHeight, flexDirection: 'row', backgroundColor: 'white' }}>
                            <View style={{ width: 30, height: svgHeight }}>
                                {DrawYXAxisValue(yAxis, false, svgHeight, rectWidth * rectNum + 2 * interWidth)}
                            </View>
                            <View style={{ flex: 0 }}>
                                <Svg width={svgWidth} height={svgHeight}>
                                    {DrawXYAxisLine(barCanvasHeight, svgHeight, false, this.props.valueInterval)}
                                    {this.renderBarItem()}
                                </Svg>
                            </View>
                            <View style={{ width: svgWidth, height: svgHeight, position: 'absolute', top: 0, right: 0 }}>
                                {this.renderClickItemView()}
                            </View>
                        </View>
                    </ScrollView>
                    {DrawXValueView(valueInterval, barCanvasHeight, viewWidth, maxNum)}
                </View >
            </View >
        )
    }
}

