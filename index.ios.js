/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

var api =require('./src/components/api'),
    Login = require('./src/View/Login'),
    Home = require('./src/View/Home'),
    screen = Dimensions.get('window');

var DWithReact = React.createClass({
  getInitialState(){
    return {
      isLogin:false,
      isLogining:false,
    }
  },
  async _loadInitialState(){
    var isLogin=await api.storage.getItem("ACCESS_TOKEN");
    if (isLogin){
      this.setLogin();
    }else{
      this.setState({
        isLogin:false,
        isLogining:true,
      });
    }
  },
  setLogin(){
    this.setState({
      isLogin:true,
      isLogining:false,
    })
  },
  componentWillMount(){
    this._loadInitialState().done();
  },
  handleLogin(login){
    if (login){
      this.setLogin();
    }
  },
  _renderLogin(){
      return (
         <View>
          <Login updateLogin={this.handleLogin} />
          </View>
        )
  },
  render() {
    if (this.state.isLogin){
      return (<Home />)
    }else {
      return (
        <View>
            {this.state.isLogining ? this._renderLogin():null}
        </View>
        )
    }
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatar:{
    margin:10,
    width:80,
    height:80,
    borderWidth:2,
    borderColor:"#233"
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  playerImageModal: {
    height: screen.height / 3,
    resizeMode: "contain"
  },
  wrapper: {
      flex: 1
  }
});

AppRegistry.registerComponent('DWithReact', () => DWithReact);
