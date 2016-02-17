'use strict';

import React,{
	NavigatorIOS,
	TabBarIOS,
	StyleSheet,
	TouchableWithoutFeedback,
} from 'react-native';

var ShotList = require("./ShotList"),
	Player = require("./Player"),
	Test = require("./Test"),
	Icon = require("react-native-vector-icons/FontAwesome"),
	RCTDeviceEventEmitter = require("RCTDeviceEventEmitter");
var Home= React.createClass({
	getInitialState(){
		return {
			selectedTab:'default',
			oldDate:'',
		}
	},
	_renderContent: function(component: Object, title: ?string) {
	  var passProps = {};
	  return (
	    <NavigatorIOS ref="navigator" style={styles.wrapper}
	      initialRoute={{
	        component: component,
	        title: title,
	        passProps: passProps
	      }}
	    />
	  );
	},
	_handlePress(){
		var newDate = Date.now();
		var oldDate = this.state.oldDate;
		if (oldDate){
			if ((newDate-oldDate)<=400){
				this.setState({
					oldDate:"",
				})
				RCTDeviceEventEmitter.emit('scrollToTop',true);
			}else{
				this.setState({
				  oldDate:newDate,
				  selectedTab:'default',
				})
			}
		}else{
			this.setState({
			  oldDate:newDate,
			  selectedTab:'default',
			})
		}
	},
	render(){
	  return(
	    <TabBarIOS tintColor={"#ea4c89"}>
	        <Icon.TabBarItem title="Shots" iconName="dribbble" selectedIconName="dribbble" selected={this.state.selectedTab === 'default'} onPress={()=>{
	        	this._handlePress()
	        }}  >
	        {this._renderContent(ShotList,"Shots")}
	        </Icon.TabBarItem>
	        <Icon.TabBarItem title="Player" iconName="user" selectedIconName="user" selected={this.state.selectedTab === 'user'} onPress={()=>{
	          this.setState({
	            selectedTab:'user',
	          })
	        }} >
	        {this._renderContent(Player,"Player")}
	        </Icon.TabBarItem>
	        <Icon.TabBarItem title="Test" iconName="user" selectedIconName="user" selected={this.state.selectedTab === 'Test'} onPress={()=>{
	          this.setState({
	            selectedTab:'Test',
	          })
	        }} >
	        {this._renderContent(Test,"Test")}
	        </Icon.TabBarItem>
	    </TabBarIOS>
	    )
	}
})


const styles = StyleSheet.create({
  wrapper: {
      flex: 1
  },
  filter:{
  	backgroundColor:"#000"
  },
});


module.exports=Home