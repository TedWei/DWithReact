'use strict';

import React,{
	NavigatorIOS,
	TabBarIOS,
	StyleSheet,
	TouchableWithoutFeedback,
} from 'react-native';

var ShotList = require("./ShotList"),
	Icon = require("react-native-vector-icons/FontAwesome"),
	RCTDeviceEventEmitter = require("RCTDeviceEventEmitter");
var Home= React.createClass({
	getInitialState(){
		return {
			selectedTab:'default',
			oldDate:'',
		}
	},
	_renderContent: function(category: string, title: ?string) {
	  var passProps = {};
	  passProps.filter=category;
	  return (
	    <NavigatorIOS ref="navigator" scroll={this.state.scrollToTop} style={styles.wrapper}
	      initialRoute={{
	        component: ShotList,
	        title: "Shots",
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
	        {this._renderContent("default","Shots")}
	        </Icon.TabBarItem>
	        <Icon.TabBarItem title="Debuts" iconName="trophy" selectedIconName="trophy" selected={this.state.selectedTab === 'debuts'} onPress={()=>{
	          this.setState({
	            selectedTab:'debuts',
	          })
	        }} >
	        {this._renderContent("debuts","Debuts")}
	        </Icon.TabBarItem>
	        <Icon.TabBarItem title="Animated" iconName="heart" selectedIconName="heart" selected={this.state.selectedTab === 'animated'} onPress={()=>{
	          this.setState({
	            selectedTab:'animated',
	          })
	        }} >
	        {this._renderContent("animated","Animated")}
	        </Icon.TabBarItem>
	        <Icon.TabBarItem title="Rebounds" iconName="lightbulb-o" selectedIconName="lightbulb-o" selected={this.state.selectedTab === 'rebounds'} onPress={()=>{
	          this.setState({
	            selectedTab:'rebounds',
	          })
	        }} >
	        {this._renderContent("rebounds","Rebounds")}
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