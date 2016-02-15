"use strict";

import React,{
	ActivityIndicatorIOS,
	ListView,
	StyleSheet,
	Text,
	TextInput,
	View
} from "react-native"

var Loading = require('../components/Loading'),
	api=require('../components/api');

var ShotList=React.createClass({
	getInitialState(){
		return {
			user:{},
		}
	},
	getUser(){
		var _that = this;
	    api.getUser().then((responseData) => {
	      _that.setState({
	        user:responseData
	      })
	    })
	},
	async _loadInitialState(){
	  var isLogin=await api.storage.getItem("ACCESS_TOKEN");
	  if (isLogin){
	    this.getUser();
	  }
	},
	componentWillMount(){
		this._loadInitialState();
	},
	_renderView(){
		return (
			<View style={styles.separator} >
			<Text>{this.props.filter}</Text>
			<Text>{this.state.user.name}</Text>
			</View>
			)
	},
	render(){
		return(
			<View style={styles.container}>
			{this.state.user.name ? this._renderView():<Loading />}
			</View>
			)
	}
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center"
  },
  separator: {
    height: 1,
    backgroundColor: "transparent",
  },
  scrollSpinner: {
    marginVertical: 20,
  },
});


module.exports=ShotList