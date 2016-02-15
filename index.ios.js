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

var api =require('./src/components/api');

var Loading = require('./src/components/Loading');

var Login = require('./src/View/Login')

var screen = Dimensions.get('window');

var DWithReact = React.createClass({
  getInitialState(){
    return {
      user:{
        name:"zhang"
      },
      isLoading:false,
      isModalOpen:false,
      isLogin:true,
      isLogining:false,
      loginResponse:{},
    }
  },
  getUser(){
      api.getUser().then((responseData) => {
        this.setState({
          user:responseData
        })})
  },
  async _loadInitialState(){
    var isLogin=await api.storage.getItem("ACCESS_TOKEN");
    if (isLogin){
      this.getUser();
      this.setState({
        isLogin:true,
        isLogining:false,
      })
    }else{
      this.getLogin();
      this.setState({
        isLogin:false,
        isLogining:true,
      })
    }
  },
  getLogin(){
    var _that = this;
    if (!this.state.isLogining){
       api.getAuthorize().then((responseData)=>{
        if (responseData.isLogining){
          this.setState({
            isLogining:true,
            loginResponse:responseData.responseData
          })
        }else if(responseData.isLogin){
          _that.getUser()
          this.setState({
            isLogin:true,
            isLogining:false,
          })
        }
       })
     }
  },
  componentWillMount(){
    this._loadInitialState().done();
  },
  getAvatar(){
    return(
      <TouchableOpacity onPress={this.openModal}>
      <Image style={styles.avatar}
        source={{uri: this.state.user.avatar_url}} />
        </TouchableOpacity>
      )
  },
  openModal(){
    this.setState({
      isModalOpen:true
    });
  },
  closeModal(){
    console.log("close modal")
    this.setState({
      isModalOpen:false
    });
  },
  _renderView(){
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Simple Dribble:{this.state.user.name}
        </Text>
        {this.state.user.avatar_url ? this.getAvatar():null}
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
      )
  },
  handleLogin(login){
    if (login){
      this.getUser()
      this.setState({
        isLogin:true,
        isLogining:false,
      })
    }
  },
  _renderLogin(){
      return (
          <Login visible={!this.state.isLogin} updateLogin={this.handleLogin} login={this.state.isLogin} html={this.state.loginResponse._bodyText} url={this.state.loginResponse.url} onDismiss={this.loginDismis}/>
        )
  },
  _renderLoading(){
    return (<Loading />)
  },
  render() {
    return (
      <View>
        {this.state.isLogin ? this._renderView():this.getLogin()}
        {this.state.isLogining ? this._renderLogin() : null}
        <TouchableOpacity onPress={this.closeModal}>
        <Modal visible={this.state.isModalOpen} onDismiss={this.closeModal}>
            <Image style={styles.playerImageModal} source={{uri:this.state.user.avatar_url}} />
        </Modal>
        </TouchableOpacity>
      </View>
      );
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
});

AppRegistry.registerComponent('DWithReact', () => DWithReact);
