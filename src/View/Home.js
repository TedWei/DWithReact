'use strict';

import React,{
	NavigatorIOS,
	TabBarIOS,
	StyleSheet,
	TouchableWithoutFeedback,
	Animated,
	Dimensions,
	View,
} from 'react-native';

var ShotList = require("./ShotList"),
	Player = require("./Player"),
	Test = require("./Test"),
	ModalWithBlur = require("./ModalWithBlur"),
	Icon = require("react-native-vector-icons/FontAwesome"),
	screen = Dimensions.get("window"),
	RCTDeviceEventEmitter = require("RCTDeviceEventEmitter");
var Home= React.createClass({
	getInitialState(){
		return {
			selectedTab:'default',
			oldDate:'',
			viewScale:new Animated.Value(1)
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
	componentDidMount(){
		var _that =this;
		RCTDeviceEventEmitter.addListener('showModal',function(modal){
		  _that._showModal(modal)
		})
		RCTDeviceEventEmitter.addListener('closeModal',function(modal){
		  _that._closeModal(modal)
		})
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
	_showModal(modal){
		this.setState({
			modalContainer:modal,
			isModalOpen:true,
		})
		this._animatedView();
	},
	_closeModal(){
		this.setState({
			isModalOpen:false
		})
		this._cancelAnimatedView();
	},
	_animatedView(){
	    this.state.viewScale.setValue(1);     // Start large
	    Animated.spring(                          // Base: spring, decay, timing
	      this.state.viewScale,                 // Animate `bounceValue`
	      {
	        toValue: 0.95,                         // Animate to smaller size
	      }
	    ).start();                                // Start the animation
	},
	_cancelAnimatedView(){
	    this.state.viewScale.setValue(0.95);     // Start large
	    Animated.spring(                          // Base: spring, decay, timing
	      this.state.viewScale,                 // Animate `bounceValue`
	      {
	        toValue: 1,                         // Animate to smaller size
	      }
	    ).start();                                // Start the animation
	},
	_renderModal(){
		return <ModalWithBlur closeModal={this._closeModal} modalContainer={this.state.modalContainer} />
	},
	render(){
		var scale = {
		    transform: [{scaleX: this.state.viewScale}, {scaleY: this.state.viewScale}],
		}
	  return(
	  	<View style={styles.rootView}>
	  	<View style={styles.blank}>
	  	</View>
	  	<Animated.View style={scale}>
	  	<View style={this.state.isModalOpen ? [styles.container,styles.borderRidus]:[styles.container]}>
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
	    </View>
	    </Animated.View>
	    {this.state.isModalOpen ? this._renderModal():null}
	    </View>
	    )
	}
})


const styles = StyleSheet.create({
  wrapper: {
      flex: 1
  },
  rootView:{
  	flex:1,
  },
  blank:{
  	width:screen.width,
  	height:screen.height,
  	backgroundColor:"#000",
  	position:"absolute",
  },
  borderRidus:{
  	borderRadius:3,
  	overflow:"hidden"
  },
  container:{
  	width:screen.width,
  	height:screen.height,
  	backgroundColor:"#000"
  },
  filter:{
  	backgroundColor:"#000"
  },
});


module.exports=Home