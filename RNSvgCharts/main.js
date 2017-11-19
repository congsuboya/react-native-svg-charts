import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native';


export default class Main extends React.Component {

    static navigationOptions = {
        title: '主列表',
        headerTitleStyle: {
            alignSelf: 'center'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            Data: [
                { name: '水平普通柱形图', id: 1 },
                { name: '水平堆叠柱形图', id: 2 },
                { name: '竖直普通柱形图', id: 3 },
                { name: '竖直堆叠柱形图', id: 4 },
                { name: '折线图', id: 5 },
                { name: '漏斗图', id: 6 },
                { name: '扇形图', id: 7 }
            ]
        }
        this.renderItem = this.renderItem.bind(this);
        this.clickItem = this.clickItem.bind(this);
    }

    clickItem(Id) {
        const { navigate } = this.props.navigation;
        switch (Id) {
            case 1:
                navigate('HorizontalBar')
                return;
            case 2:
                navigate('HorizontalBarStack')
                return;
            case 3:
                navigate('VerticalBar')
                return;
            case 4:
                navigate('VerticalBarStack')
                return;
            case 5:
                navigate('LineDemo')
                return;
            case 6:
                navigate('FunnelDemo')
                return;
            case 7:
                navigate('PieDemo')
                return;
            case 100:
                navigate('WebDemo')
                return;
        }
    }

    renderItem({ item }) {
        return (
            <TouchableOpacity onPress={() => this.clickItem(item.id)} >
                <View key={item.id} style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <FlatList
                data={this.state.Data}
                renderItem={this.renderItem}
                ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: 'gray' }} />}
            />
        )
    }
}