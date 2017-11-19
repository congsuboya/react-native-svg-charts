import React, { Component } from 'react';
import { View, Dimensions, TouchableWithoutFeedback, Text } from 'react-native';
import Svg, {
    Text as SvgText,
    Polygon
} from 'react-native-svg';

import ColorList from '../globalVariable';

import ToastView from './toastView';

export default class Funnel extends Component {

    constructor(props) {
        super(props);
        let { height, width } = props.style;
        let viewHeight = height ? height : 300;
        let viewWidth = width ? width : window.width;
        let funnelData = props.option.series[0].data;
        if (props.option.sort) {
            funnelData.sort(function (a, b) {
                return b.value - a.value;//a-b输出从小到大排序，b-a输出从大到小排序
            });
        }
        this.state = {
            selectedIndex: null,
            viewHeight,
            viewWidth,
            perHeight: (viewHeight - 20) / funnelData.length,
            funnelData: funnelData,
            interNum: funnelData.length,
            ...props.option
        }
        this.renderTrapezoid = this.renderTrapezoid.bind(this);
        this.clickItemView = this.clickItemView.bind(this);
    }

    getMaxNum(funnelData) {
        let maxNum = 0;
        funnelData.map((item) => {
            if (item.value > maxNum) {
                maxNum = item.value;
            }
        });
        return maxNum;
    }

    renderTrapezoid() {

        let { maxWidth, series, viewHeight, interNum, funnelData, minWidth, perHeight } = this.state;
        let trapezoidViews = [];
        let maxNum = this.getMaxNum(funnelData);
        let perWidth = (maxWidth - minWidth) / maxNum / 2;
        let midpointX = maxWidth / 2;
        let initX, lastX, polygonPath;

        funnelData.map((item, index) => {
            if (index == 0) {
                lastX = item.value * perWidth;
            } else {
                initX = item.value * perWidth;
                polygonPath = `${midpointX - lastX - minWidth / 2},${(index - 1) * perHeight} ${midpointX + lastX + minWidth / 2},${(index - 1) * perHeight} ${midpointX + initX + minWidth / 2},${index * perHeight} ${midpointX - initX - minWidth / 2},${index * perHeight}`;
                trapezoidViews.push(<Polygon points={polygonPath} fill={ColorList[index - 1]} />);
                lastX = initX;
                if (perHeight > 10) {
                    trapezoidViews.push(<SvgText x={midpointX} y={(index - 1) * perHeight + (perHeight - 10) / 2} fontSize='9' fill='white' textAnchor='middle' >{funnelData[index - 1].name}</SvgText>);
                }
            }
        });

        if (lastX) {
            polygonPath = `${midpointX - lastX - minWidth / 2},${(interNum - 1) * perHeight} ${midpointX + lastX + minWidth / 2},${(interNum - 1) * perHeight} ${midpointX + minWidth / 2},${interNum * perHeight} ${midpointX - minWidth / 2},${interNum * perHeight}`;
            trapezoidViews.push(<Polygon points={polygonPath} fill={ColorList[interNum]} />);
            if (perHeight > 10) {
                trapezoidViews.push(<SvgText x={midpointX} y={(interNum - 1) * perHeight + (perHeight - 10) / 2} fontSize='9' fill='white' textAnchor='middle' >{funnelData[interNum - 1].name}</SvgText>);
            }
        }
        return trapezoidViews;
    }


    clickItemView(location) {
        let { perHeight, funnelData, maxWidth, viewWidth } = this.state;
        let clickIndex = parseInt(location.locationY / perHeight)
        let series = [{
            name: funnelData[clickIndex].name,
            data: [funnelData[clickIndex].value]
        }]
        let newLocation = Object.assign(location, { locationX: location.locationX + (viewWidth - maxWidth) / 2 })
        this.refs.toast.show(0, series, location, ColorList[clickIndex])
    }

    render() {

        let { maxWidth, minWidth, viewHeight } = this.state;

        return (
            <View style={[{ alignItems: 'center' }, this.props.style]} >
                <View style={{ flex: 0 }}>
                    <Svg width={maxWidth} height={viewHeight - 20}>
                        {this.renderTrapezoid()}
                    </Svg>
                    <TouchableWithoutFeedback onPress={(e) => this.clickItemView(e.nativeEvent)}>
                        <View style={{ width: maxWidth, height: viewHeight - 20, position: 'absolute', top: 0, right: 0 }} />
                    </TouchableWithoutFeedback>
                </View>
                <ToastView ref="toast"></ToastView>
            </View>
        )
    }
}


Funnel.defaultProps = {
    option: {
        maxWidth: 240,
        minWidth: 50,
        series: [
            {
                name: '漏斗图',
                type: 'funnel',
                data: [
                    { value: 60, name: '访问' },
                    { value: 30, name: '咨询' },
                    { value: 10, name: '订单' },
                    { value: 80, name: '点击' },
                    { value: 100, name: '展现' }
                ]
            },
        ],
        sort: true
    },
    style: { height: 400, width: window.width }
};
