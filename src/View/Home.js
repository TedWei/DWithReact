'use strict';

import React,{
	NavigatorIOS,
	TabBarIOS,
	StyleSheet,
} from 'react-native';

var ShotList = require("./ShotList"),
	Icon = require("react-native-vector-icons/FontAwesome");
var Home= React.createClass({
	getInitialState(){
		return {
			selectedTab:'default',
		}
	},
	_renderContent: function(category: string, title: ?string) {
	  var passProps =   {filter: category};
	  return (
	    <NavigatorIOS style={styles.wrapper}
	      initialRoute={{
	        component: ShotList,
	        title: title,
	        passProps: passProps
	      }}
	    />
	  );
	},
	render(){
	  return(
	    <TabBarIOS tintColor={"#ea4c89"}>
	        <Icon.TabBarItem title="All" iconName="dribbble" selectedIconName="dribbble" selected={this.state.selectedTab === 'default'} onPress={()=>{
	          this.setState({
	            selectedTab:'default',
	          })
	        }} >
	        {this._renderContent("default","All")}
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
  }
});


module.exports=Home