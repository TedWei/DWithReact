'use strict';

import React,{
	NavigatorIOS,
	TabBarIOS,
	StyleSheet,
	TouchableWithoutFeedback,
	Animated,
	Dimensions,
	Text,
	View,
} from 'react-native';

var ShotList = require("./ShotList"),
	Player = require("./Player"),
	Test = require("./Test"),
	ModalWithAnimated = require("../components/Modal"),
	ModalWithBlur = require("./ModalWithBlur"),
	Icon = require("react-native-vector-icons/FontAwesome"),
	screen = Dimensions.get("window"),
	RCTDeviceEventEmitter = require("RCTDeviceEventEmitter");
var Home= React.createClass({
	getInitialState(){
		return {
			selectedTab:'default',
			oldDate:'',
			notification:{},
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
		this._hanldeModal();
		this._hanndleNotification();
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
	_hanldeModal(){
		var _that =this;
		RCTDeviceEventEmitter.addListener('showModal',function(modal){
		  _that._showModal(modal)
		})
		RCTDeviceEventEmitter.addListener('closeModal',function(modal){
		  _that._closeModal(modal)
		})

		RCTDeviceEventEmitter.addListener('showConfirm',function(modal){
		  _that._showConfirm(modal)
		})
	},
	_hanndleNotification(){
		var _that =this;
		RCTDeviceEventEmitter.addListener('notification',function(notification){
		  	_that.setState({
		  		notification:{
		  			category:notification.category,
		  			content:notification.content,
		  		}
		  	})
		})
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
	    this.state.viewScale.setValue(1);
	    Animated.spring(
	      this.state.viewScale,
	      {
	        toValue: 0.95,
	      }
	    ).start();
	},
	_cancelAnimatedView(){
	    this.state.viewScale.setValue(0.95);
	    Animated.spring(
	      this.state.viewScale,
	      {
	        toValue: 1,
	      }
	    ).start();
	},
	_renderModal(){
		return (<ModalWithBlur closeModal={this._closeModal} modalContainer={this.state.modalContainer} />)
	},
	_renderConfirm(){
		return (<ModalWithBlur closeModal={this._closeConfirm} modalContainer={this.state.confirm} />)
	},
	_showConfirm(modal){
		this.setState({
			confirm:modal,
			showConfirm:true,
		})
	},
	_closeConfirm(){
		this.setState({
			showConfirm:false,
		})
	},
	_closeTips(){
		this.setState({
			notification:{},
		})
	},
	_renderNotification(){
		return (
			<ModalWithAnimated.Tips callback={this._closeTips}><Text style={styles.tips}>{this.state.notification.content}</Text></ModalWithAnimated.Tips>
			)
	},
	render(){
		var scale = {
		    transform: [{scaleX: this.state.viewScale}, {scaleY: this.state.viewScale}],
		}
	  return(
	  	<View style={styles.rootWindow}>
	  	<View style={styles.rootView}>
	  	<View style={styles.blank}>
	  	</View>
	  	<Animated.View style={scale}>
	  	<View style={this.state.isModalOpen ? [styles.container,styles.borderRidus]:[styles.container]}>
	    <TabBarIOS tintColor={"#333"} style={styles.tabbar}>
	        <Icon.TabBarItem style={styles.tabbarItem} title="Shots" iconName="dribbble" selectedIconName="dribbble" selected={this.state.selectedTab === 'default'} onPress={()=>{
	        	this._handlePress()
	        }}  >
	        {this._renderContent(ShotList,"Shots")}
	        </Icon.TabBarItem>
	        <Icon.TabBarItem style={styles.tabbarItem} title="Player" iconName="user" selectedIconName="user" selected={this.state.selectedTab === 'user'} onPress={()=>{
	          this.setState({
	            selectedTab:'user',
	          })
	        }} >
	        {this._renderContent(Player,"Player")}
	        </Icon.TabBarItem>
	        <Icon.TabBarItem style={styles.tabbarItem} title="Test" iconName="user" selectedIconName="user" selected={this.state.selectedTab === 'Test'} onPress={()=>{
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
	    {this.state.showConfirm ? this._renderConfirm():null}
	    </View>
	    {this.state.notification.category ? this._renderNotification():null}
	    </View>
	    )
	}
})


const styles = StyleSheet.create({
  wrapper: {
      flex: 1
  },
  rootWindow:{
  	flex:1,
  },
  rootView:{
  	flex:1,
  },
  tabbar:{
  },
  tabbarItem:{
  	// opacity:0.9
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
  tips:{
  	alignItems:"center",
  },
});


module.exports=Home