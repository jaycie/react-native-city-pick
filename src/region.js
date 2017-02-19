/**
 * 省市区级联
 */
import React, {Component} from 'react';

import {
  View,
  Text,
  Animated,
  Picker,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';

import Webapi from './webapi';

const {width, height} = Dimensions.get('window');
let _Data = [];

export default class Region extends Component {
  constructor(props, context) {
      super(props, context);
      this.state = {
        //距离顶部的距离
        topValue: new Animated.Value(0),
        //省
        province: [],
        //市
        city: [],
        //地区
        area: [],
        //选中的省
        selectedProvince: this.props.selectedProvince || '330000',  //首次打开默认的值,参见：https://static.yjsvip.com/static/js/city_data_1.0.js
        //选中的市
        selectedCity: this.props.selectedCity || '330100',
        //选中的地区
        selectedArea: this.props.selectedArea || '330110'
      }
  }


  /**
   * 改变新属性
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible) {
      //开始动画
      Animated.spring(this.state.topValue, {
        toValue: nextProps.visible ? height : 0,
        friction: 10,
        tension: 30
      }).start();
    }
  }


  componentWillMount() {
    //开始动画
    this.startAnimate();
  }


  render() {
    return (
      <Animated.View ref='region' style={[styles.container, {
          top: this.state.topValue.interpolate({
            inputRange: [0, height],
            outputRange: [height, 0]
          })
        }]}>
        <View style={styles.region}>
          {/*头部按钮*/}
          <View style={styles.nav}>
            <TouchableOpacity onPress={this._handleCancel.bind(this)}>
              <Text style={styles.text}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._handleSubmit.bind(this)}>
              <Text style={styles.text}>确认</Text>
            </TouchableOpacity>
          </View>

          {/*省市区级联*/}
          <View style={styles.regionArea}>
            {/*省*/}
            <Picker
              style={styles.regionItem}
              onValueChange={this._handleProvinceChange.bind(this)}
              selectedValue={this.state.selectedProvince}>
              {this.state.province.map((v, k) => {
                return (
                  <Picker.Item value={v[0]} label={v[1]} key={k}/>
                );
              })}
            </Picker>

            {/*市*/}
            <Picker
              style={styles.regionItem}
              onValueChange={this._handleCityChange.bind(this)}
              selectedValue={this.state.selectedCity}>
              {this.state.city.map((v, k) => {
                return (<Picker.Item value={v[0]} label={v[1]} key={k}/>);
              })}
            </Picker>

            {/*区*/}
            <Picker
              style={styles.regionItem}
              onValueChange={this._handleAreaChange.bind(this)}
              selectedValue={this.state.selectedArea}>
              {this.state.area.map((v, k) => {
                return (<Picker.Item value={v[0]} label={v[1]} key={k}/>);
              })}
            </Picker>
          </View>
        </View>
      </Animated.View>
    );
  }


  componentDidMount() {
    Webapi
      .fetchRegionData()
      .then((data) => {
        //cache it.
        _Data = data;

        //过滤省
        var province = this._filter('086');
        this._selectedProvinceName = _Data[this.state.selectedProvince][0];

        //过滤省对于的市
        var city = this._filter(this.state.selectedProvince);

        //市的名字
        this._selectedCityName = '';
        if (this.state.selectedCity) {
          this._selectedCityName = _Data[this.state.selectedCity][0];
        }

        //过滤第一个市对应的区
        var area = [];
        if (this.state.selectedCity) {
          area = this._filter(this.state.selectedCity);

          this._selectAreaName = '';
          if (this.state.selectedArea) {
            this._selectAreaName = _Data[this.state.selectedArea][0];
          }
        }

        this.setState({
          province: province,
          city: city,
          area: area
        });
      });
  }

  /**
   * 执行动画
   */
  startAnimate() {
    Animated.spring(this.state.topValue, {
      toValue: this.props.visible ? height : 0,
      friction: 10,
      tension: 30
    }).start();
  }

   /**
   * 隐藏动画
   */
  stopAnimate() {
    Animated.spring(this.state.topValue, {
      toValue: 0,
      friction: 10,
      tension: 30
    }).start(this.props.cancled());
  }


  /**
   * 处理省的改变
   */
  _handleProvinceChange(province) {
    //设置选中的省的名称
    this._selectedProvinceName = _Data[province][0];

    if (__DEV__) {
      console.log('省发生改变:', province, this._selectedProvinceName);
    }

    //过滤出改变后，省对应的市
    var city = this._filter(province);
    //省下面没有市，包括台湾，香港，澳门
    if (city.length === 0) {
      this._selectAreaName = '';
      this._selectedCityName = '';

      this.setState({
        selectedProvince: province,
        selectedCity: '',
        selectedArea: '',
        city: [],
        area: []
      });
    } else {
      this._selectedCityName = city[0][1];
      //过滤区域
      var area = this._filter(city[0][0]);
      //区域名称
      this._selectAreaName = area[0][1];

      this.setState({
        selectedProvince: province,
        selectedCity: city[0][0],
        selectedArea: area[0][0],
        city: city,
        area: area,
      });
    }
  }


  /**
   * 处理市改变
   */
  _handleCityChange(city) {
    this._selectedCityName = _Data[city][0];

    if (__DEV__) {
      console.log('市发生改变:', city, this._selectedCityName);
    }

    //过滤出市变化后，区
    var area = this._filter(city);
    if (area.length === 0) {
      this._selectAreaName = '';
      this.setState({
        selectedCity: city,
        selectedArea: '',
        area: []
      });
    } else {
      this._selectAreaName = area[0][1];

      this.setState({
        selectedCity: city,
        selectedArea: area[0][0],
        area: area
      });
    }
  }


  /**
   * 处理区域改变
   */
  _handleAreaChange(area) {
    this._selectAreaName = _Data[area][0];

    if (__DEV__) {
      console.log('区域发生改变:', area, this._selectAreaName);
    }

    this.setState({
      selectedArea: area
    })
  }


  /**
   * 处理取消
   */
  _handleCancel() {
    this.stopAnimate();
  }


  /**
   * 处理确定
   */
  _handleSubmit() {
    this.stopAnimate();
    this.props.setChoosed(this._selectedProvinceName, this._selectedCityName, this._selectAreaName);
  }


  /**
   * 根据pid查询子节点
   */
  _filter(pid) {
    var result = [];

    for (var code in _Data) {
      if (_Data.hasOwnProperty(code)
          && _Data[code][1] === pid) {
        result.push([code, _Data[code][0]]);
      }
    }

    return result;
  }
};


var styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    left: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  nav: {
    height: 40,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffeaea',
    flexDirection: 'row'
  },
  text: {
    color: '#e61d4c',
    fontSize: 15,
    fontWeight: 'bold'
  },
  region: {
    flex: 1,
    marginTop: 3*height/5,
    backgroundColor: '#FFF'
  },
  regionArea: {
    flexDirection: 'row',
  },
  regionItem: {
    flex: 1,
  }
});

