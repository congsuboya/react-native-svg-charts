# rn-svg-chart

使用Svg 画的各种图标，方便使用，会慢慢完善，现在动画欠缺，会找一个不怎么耗性能的动画方式敬请期待



### Installation


1. 通过`npm` 安装

    ```bash
    npm install rn-svg-chart --save
    ```
    
1. 通过`yarn` 安装

    ```bash
    yarn add rn-svg-chart
    ```


### 使用

```javascript

import React, { Component } from 'react';
import {
    View,
    TextInput,
    Button,
    Slider,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
import {
    Bar
} from 'rn-svg-chart';

class DemoExample extends Component {
    render() {
        return (
           <View style={{ flex: 1, alignItems: 'center' }}>
                <Bar style={{ height: 230, width: width }} option={this.props.option} />
            </View>
        );
    }
}
```