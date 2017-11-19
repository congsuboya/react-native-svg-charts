import React, { Componet } from 'react';
import {
    View,
    Dimensions,
    Animated,
    NativeModules,
    LayoutAnimation
} from 'react-native';

import Svg, {
    Circle,
    Path,
    Rect,
    G,
    Text
} from 'react-native-svg';
const window = Dimensions.get('window');

import ColorList from '../globalVariable';

import ToastView from './toastView';

let AnimatedPath = Animated.createAnimatedComponent(Path);
let AnimatedG = Animated.createAnimatedComponent(G);


export default class Pie extends React.Component {

    constructor(props) {
        super(props);
        super(props);
        let { height, width } = props.style;
        let viewHeight = height ? height : 300;
        let viewWidth = width ? width : window.width;
        let pieData = props.option.series[0].data;
        let svgCanvasHeight = viewHeight < viewWidth ? viewHeight : viewWidth;
        let pieR = (svgCanvasHeight - 5) / 22 * 10;

        let sum = 0;
        pieData.map((item, index) => {
            sum += item.value;
        })
        this.state = {
            selectedIndex: -1,
            viewHeight,
            viewWidth,
            pieR,
            sum,
            pieData: pieData,
            interNum: pieData.length,
            cx: svgCanvasHeight / 2,
            cy: svgCanvasHeight / 2,
            svgCanvasHeight,
            ...props.option
        }
        this.pieItemViewList = [];
        this.renderPieItemView = this.renderPieItemView.bind(this);
        this.clickItemView = this.clickItemView.bind(this);
    }

    componentWillMount() {

    }

    renderPieItemView() {

        if (this.pieItemViewList.length > 0) {
            return this.pieItemViewList;
        }
        let { pieR, pieData, svgCanvasHeight, sum, cx, cy } = this.state;
        let pathViews = [];
        let textViews = [];
        let perPieDeg = 0;
        let xList = [cx];
        let yList = [(cy - pieR)];
        let radian = 0;
        let textradian = 0;

        let textValue;
        pieData.map((item, index) => {
            textradian = 0;
            if (360 * (item.value / sum) > 20) {
                textradian = (perPieDeg + 180 * (item.value / sum)) * Math.PI / 180;
                textValue = (item.value / sum * 100).toFixed(1) + '%';
            }


            perPieDeg = 360 * (item.value / sum) + perPieDeg;
            radian = perPieDeg * Math.PI / 180;

            xList.push(cx + pieR * Math.sin(radian));
            yList.push(cy - pieR * Math.cos(radian));

            pathViews.push(
                <Path
                    onPress={(e) => this.clickItemView(index, item, textValue, e.nativeEvent)}
                    key={index}
                    fill={ColorList[index]}
                    d={`M${cx} ${cy},L${xList[index]} ${yList[index]},A${pieR} ${pieR}, 0 ${(360 * (item.value / sum)) > 180 ? '1' : '0'} 1 ${xList[index + 1]},${yList[index + 1]} Z`} />
            );

            if (textradian > 0) {
                textViews.push(
                    <Text
                        key={index + 'text'}
                        fill="#FFFFFF"
                        x={cx + pieR * Math.sin(textradian) * 0.7}
                        y={cy - pieR * Math.cos(textradian) * 0.7}
                        fontSize="9"
                        textAnchor="middle">
                        {textValue}
                    </Text>
                )
            }


        });
        this.pieItemViewList = pathViews.concat(textViews);
        return this.pieItemViewList;

    }

    clickItemView(index, item, textValue, location) {
        let { selectedIndex } = this.state;
        if (selectedIndex != index) {
            this.setState({
                selectedIndex: index
            });
            let series = [{
                name: item.name,
                data: [item.value + '--' + textValue]
            }]
            this.refs.toast.show(0, series, location, ColorList[index]);
        }
    }



    componentDidMount() {

    }


    render() {
        let { svgCanvasHeight, selectedIndex, cx, cy } = this.state;
        let itemViewList = this.renderPieItemView();
        return (
            <View style={[{ alignItems: 'center' }, this.props.style]}>
                <View style={{ flex: 0 }}>
                    <Svg height={svgCanvasHeight} width={svgCanvasHeight}>
                        {itemViewList.map((item, index) => {
                            if (selectedIndex > -1 && index == selectedIndex) {
                                return (<G
                                    scale={1.1}
                                    origin={`${cx},${cy}`}
                                >
                                    {item}
                                </G>)
                                item;
                            } else {
                                return item;
                            }
                        })}
                    </Svg>
                </View>
                <ToastView ref='toast' />
            </View>
        )
    }
}


Pie.defaultProps = {
    option: {
        series: [
            {
                name: '扇形图',
                type: 'funnel',
                data: [
                    { value: 60, name: '访问' },
                    { value: 30, name: '咨询' },
                    { value: 10, name: '订单' },
                    { value: 80, name: '点击' },
                    { value: 100, name: '展现' }
                ]
            },
        ]
    },
    style: { height: 400, width: window.width }
};
