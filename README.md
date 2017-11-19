# rn-svg-chart

[![version](https://img.shields.io/npm/v/rn-svg-chart.svg)](https://www.npmjs.com/package/rn-svg-chart) [![downloads](https://img.shields.io/npm/dm/rn-svg-chart.svg)](https://www.npmjs.com/package/rn-svg-chart) [![license](https://img.shields.io/npm/l/rn-svg-chart.svg)](https://www.npmjs.com/package/rn-svg-chart)

使用Svg 画的各种图表，方便使用，会慢慢完善，现在动画欠缺，尽量用一个不怎么耗性能的动画方式实现。

[Check out the demo](https://github.com/congsuboya/react-native-svg-charts/tree/master/RNSvgCharts).

![](/assets/111.gif)  ![](/assets/222.gif)  ![](/assets/3333.gif)

### Installation


1. 通过`npm` 安装

    ```bash
    npm install rn-svg-chart --save
    ```
    
1. 通过`yarn` 安装

    ```bash
    yarn add rn-svg-chart
    ```


### 数据格式

参考的echarts的数据格式，有几点不同，一个是stack字段是否是堆叠图，valueInterval字段是分割线的个数，interWidth字段是柱形图之间的间隔。随着功能的完善，参数可能会有进一步的变化。

```javascript

{
    option: {
        xAxis: {
            type: 'category',
            // type: 'value',
            data: ['Mon', 'Tue', 'Wed', 'Thusssss', 'Fri', 'Sat', 'Sun', 'wqe', 'sdr', 'opu']
        },
        yAxis: {
            // type: 'category',
            type: 'value',
            data: ['Mon', 'Tue', 'Wed', 'Thusssss', 'Fri', 'Sat', 'Sun', 'wqe', 'sdr', 'opu']
        },
        series: [
            {
                name: '直接访问',
                type: 'bar',
                data: [10, 5, 2, 3, 10, 7, 6, 5, 2, 30,]
            },
            {
                name: '非直接访问',
                type: 'bar',
                data: [3, 4, 1, 4, 2, 8, 3, 3, 10, 7]
            }
        ],
        stack: false
    },
    valueInterval: 3,
    style: { height: 400, width: window.width },
    interWidth: 10
}

```



### 使用

```javascript

import React, { Component } from 'react';
import {
    View,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
import {
    Bar
} from 'rn-svg-chart';

export default class DemoExample extends Component {
    render() {
        return (
           <View style={{ flex: 1, alignItems: 'center' }}>
                <Bar style={{ height: 230, width: width }} option={this.props.option} />
            </View>
        );
    }
}


DemoExample.defaultProps = {
    option: {
        ....
    },
    valueInterval: 3,
    style: { height: 400, width: width },
    interWidth: 10
}
```