"use strict";

import React,{
	ActivityIndicatorIOS,
	ListView,
	StyleSheet,
	Text,
	TextInput,
	View
} from "react-native"

var Loading = require('../components/Loading');

var ShotList=React.createClass({
	getInitialState(){
		return {
			isLoading:true,
			dataSource:new ListView.DataSource({
				rowHasChanged:(row1,row2) => row1 !==row2
			})
		}
	},
	componentWillMount(){
		api.getResources(this.props.user.shots_url).then((responseData)=>{
			this.setState({
				dataSource:this.state.dataSource.cloneWithRows(responseData),
				isLoading:false
			})
		}).done();
	}
})