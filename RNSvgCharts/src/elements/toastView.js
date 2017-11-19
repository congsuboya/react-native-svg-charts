import React, { Component } from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    Modal
} from 'react-native';

const window = Dimensions.get('window');
import ColorList from '../globalVariable';

export default class ToastView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            series: null,
            location: null,
            showClickIndex: 0
        }
        this.renderShowItemList = this.renderShowItemList.bind(this);
    }

    show(showClickIndex, series, location, showColor = null) {
        this.setState({
            show: true,
            series: series,
            location: location,
            showClickIndex: showClickIndex,
            showColor: showColor
        })
    }

    hide() {
        this.setState({
            show: false,
            series: null,
            location: null,
            showClickIndex: null
        })
    }

    renderShowItemList() {
        let { showClickIndex, series, showColor } = this.state;
        let itemList = [];
        this.maxWidth = 0
        series.map((item, index) => {
            let tempWidth = (item.name + item.data[showClickIndex]).toString().length * 10 + 12;
            if (tempWidth > this.maxWidth) {
                this.maxWidth = tempWidth;
            }
            itemList.push(
                <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ height: 6, width: 6, marginRight: 2, backgroundColor: showColor ? showColor : ColorList[index] }} />
                    <Text style={{ color: 'white', fontSize: 9 }} >{`${item.name}：${item.data[showClickIndex]}`}</Text>
                </View>
            )
        });
        return itemList;
    }
    render() {

        if (this.state.show && this.state.series) {
            let viewX = this.state.location.locationX;
            let itemView = this.renderShowItemList();
            if (window.width - viewX < this.maxWidth) {
                viewX = viewX - this.maxWidth - 10;
            }
            return (
                <View style={{ position: 'absolute', backgroundColor: '#0E4068', top: this.state.location.locationY, left: viewX, padding: 5 }}>
                    <ScrollView
                        style={{ maxHeight: 110 }}
                    >
                        {itemView}
                    </ScrollView>
                </View>
            )
        } else {
            return null;
        }
    }
}