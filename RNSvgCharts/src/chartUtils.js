
import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';

import Svg, {
    Line,
} from 'react-native-svg';

import ColorList from './globalVariable';

export function DrawXYAxisLine(yHeight, lineLight, horizontal, intervalNum = 3) {
    let YAxisList = [];
    let interval = yHeight / intervalNum;
    let perLine = null;
    for (let i = 0; i <= intervalNum; i++) {
        if (horizontal) {
            perLine = <Line
                key={i + 'xLine'}
                x1='0'
                y1={10 + interval * i}
                x2={lineLight}
                y2={10 + interval * i}
                stroke="#EEEEEE"
                strokeWidth="1"
            />
        } else {
            perLine = <Line
                key={i + 'xLine'}
                x1={2 + interval * i}
                y1='0'
                x2={2 + interval * i}
                y2={lineLight}
                stroke="#EEEEEE"
                strokeWidth="1"
            />
        }
        YAxisList.push(perLine)
    }
    return YAxisList;
}

export function DrawYValueView(valueInterval, svgCanvasHeight, viewHeight, maxNum) {
    let valueList = [];
    let valueNum;
    for (let i = 0; i <= valueInterval; i++) {
        valueNum = maxNum * (1 - i / valueInterval);
        valueList.push(<Text
            key={i + 'yText'}
            style={{
                marginTop: i == 0 ? 5 : (svgCanvasHeight / valueInterval - 10),
                fontSize: 9,
                textAlign: 'right',
                lineHeight: 10
            }}>{parseInt(valueNum)}</Text>)
    }
    return (
        <View style={{ backgroundColor: 'white', width: 35, height: viewHeight, flexDirection: 'row' }}>
            <Text style={{
                fontSize: 9,
                width: 10,
                height: 100,
                textAlign: 'center',
                position: 'absolute',
                left: 5,
                top: (viewHeight - 120) / 2,
                textAlignVertical: 'center'
            }}>y轴名称</Text>
            <View style={{ flex: 1 }}>
                {valueList}
            </View>
        </View>
    )
}

export function DrawXValueView(valueInterval, svgCanvasWidth, viewWidth, maxNum) {
    let valueList = [];
    let valueNum;
    for (let i = valueInterval; i >= 0; i--) {
        valueNum = maxNum * (1 - i / valueInterval);
        valueList.push(<Text
            key={i + 'xText'}
            style={{
                marginLeft: i == valueInterval ? 17 : (svgCanvasWidth / valueInterval - 30),
                fontSize: 9,
                textAlign: 'center',
                lineHeight: 10,
                width: 30
            }}>{parseInt(valueNum)}</Text>)
    }
    return (
        <View style={{ backgroundColor: 'white', width: viewWidth, height: 35, }}>
            <View style={{ flexDirection: 'row' }}>
                {valueList}
            </View>
            <Text
                style={{
                    marginLeft: (viewWidth - 132) / 2,
                    marginTop: 5,
                    flex: 0,
                    fontSize: 9,
                    width: 100,
                    height: 10,
                    textAlign: 'center'
                }}>x轴名称</Text>
        </View>
    )
}

export function DrawYXAxisValue(axis, horizontal, svgLength, perLength) {
    let aXisViews = [];
    let perViewStyle = { alignItems: 'center', justifyContent: 'center', height: horizontal ? 25 : perLength, width: horizontal ? perLength : 25 };
    let perTextStyle = {
        flex: 0, fontSize: 9, color: '#292F33', textAlign: horizontal ? 'center' : 'right', height: 10, width: 25,
        transform: [{ rotate: horizontal ? -45 + 'deg' : '0deg' }]
    };
    axis.data.map((item, index) => {
        aXisViews.push(
            <View key={index + 'yValue'} style={perViewStyle}>
                <Text numberOfLines={1} style={perTextStyle}>{item}</Text>
            </View>
        )
    });

    return (
        <View style={{ height: horizontal ? 40 : svgLength, width: horizontal ? svgLength : 30, flexDirection: horizontal ? 'row' : 'column' }}>
            {aXisViews}
        </View>
    );

}


const initXAxis = {
    show: true,
    type: 'category',//'category','time','long'
    position: 'bottom',//'top'
    name: '',
    nameRotate: 0,//坐标轴旋转角度
    nameLocation: 'start',//'middle' 或者 'center' 'end'
}
const initYAxis = {
    show: true,
    type: 'value',//'value','time','long'
    position: 'left',//'right'
    name: '',
    nameRotate: 0,//坐标轴旋转角度
    nameLocation: 'end',//'middle' 或者 'center' 'end'
}


export function dealWithOption(chartWidth, chartHeight, option, valueInterval, isLine = false) {
    let xAxis = Object.assign(initXAxis, option.xAxis);
    let yAxis = Object.assign(initYAxis, option.yAxis);
    let series = option.series;
    let horizontal = true;

    let rectNum = (option.stack || isLine) ? 1 : series.length; //每个item的柱形图个数
    let intervalNum = series[0].data.length;//间隔

    if (xAxis.type == 'category' && yAxis.type == 'value') {
        horizontal = true;
    } else if (xAxis.type == 'value' && yAxis.type == 'category') {
        horizontal = false;
    }

    let svgLength = (horizontal ? chartWidth : chartHeight) - 50;
    let rectWidth = ((svgLength / intervalNum) - 20) / rectNum;//每个柱形图的宽度

    if (rectWidth < 12) {
        rectWidth = 12;
    } else if (rectWidth > 48) {
        rectWidth = 48
    }

    svgLength = (rectWidth * rectNum + 20) * intervalNum; //柱形图最大长度
    let maxNum = getMaxNum(series, intervalNum, valueInterval, option.stack);
    let axisHeight = 0;
    if ((horizontal && xAxis.show) || (!horizontal && yAxis.show)) {
        axisHeight = 35
    }

    let svgWidth = horizontal ? svgLength : chartWidth - 50;
    let svgHeight = horizontal ? chartHeight - axisHeight : svgLength;

    let barCanvasHeight = horizontal ? (svgHeight - 12) : (svgWidth - 17);
    let perRectHeight = barCanvasHeight / maxNum;

    return {
        xAxis,
        yAxis,
        horizontal,
        series,
        svgLength,
        svgWidth,
        svgHeight,
        maxNum,
        intervalNum,
        rectNum,
        rectWidth,
        barCanvasHeight,
        perRectHeight
    }
}

function getMaxNum(series, intervalNum, valueInterval, stack = false) {
    let tempMaxList = [];
    if (stack) {
        for (let i = 0; i < intervalNum; i++) {
            let tempNum = 0;
            series.map((item) => {
                tempNum += item.data[i];
            });
            tempMaxList.push(tempNum);
        }
    } else {
        series.map((item) => {
            tempMaxList.push(Math.max.apply(null, item.data));
        });
    }
    let maxData = Math.max.apply(null, tempMaxList);
    let numLength = maxData.toString().split('.')[0].length;
    let tenCube = 1;
    if (numLength > 2) {
        tenCube = Math.pow(10, numLength - 2);
    }

    let maxValue = Math.ceil(Math.ceil(maxData / tenCube) / valueInterval) * valueInterval * tenCube;
    return maxValue;
}
