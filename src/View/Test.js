"use strict";
import React,{
	View,
	ListView,
	StyleSheet,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	Modal,
	Animated,
	ScrollView,
} from 'react-native'

var getImage = require("../components/getImage"),
	screen=Dimensions.get('window'),
	ModalWithBlur = require("./ModalWithBlur"),
	Responder = require("../components/Responder"),
	ModalWithAnimated = require("../components/Modal"),
	ConfirmList =  require("../components/ConfirmList"),
	RCTDeviceEventEmitter = require("RCTDeviceEventEmitter"),
	ShotDetailWithModal = require("./ShotDetailWithModal");
const {BlurView,VibrancyView} = require("react-native-blur");

var Test = React.createClass({
	getInitialState: function() {
	      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
	      var data = Array.apply(null, {length: 20}).map(Number.call, Number);
	      return {
	        dataSource: ds.cloneWithRows(data),
	        selected:false,
	        heartScale:new Animated.Value(1),
	        isModalOpen:true,
	        translateY:new Animated.Value(0),
	      };
	},
	_renderRow(){
		return  ( <TouchableOpacity onPress={this._selectRow}>
       <Image
         source={getImage.authorAvatar()}
         style={styles.cellImage}
         accessible={true}
       />
       </TouchableOpacity>
       )
	},
	_selectRow(){
		this.setState({
			isModalOpen:true
		})
		this._animatedHeart();
		this._enter();
	},
	_closeRow(bool){
		if (bool){
			this.setState({
				selected:false
			})
		}
	},
	_enter(){
	    this.state.translateY.setValue(screen.height);     // Start large
	    Animated.spring(                          // Base: spring, decay, timing
	      this.state.translateY,                 // Animate `bounceValue`
	      {
	        toValue: 0,                         // Animate to smaller size
	        friction: 8
	      }
	    ).start();                                // Start the animation
	},
	_animatedHeart(){
	    this.state.heartScale.setValue(1);     // Start large
	    Animated.spring(                          // Base: spring, decay, timing
	      this.state.heartScale,                 // Animate `bounceValue`
	      {
	        toValue: 0.95,                         // Animate to smaller size
	      }
	    ).start();                                // Start the animation
	},
	_cancelAnimatedHeart(){
	    this.state.heartScale.setValue(0.95);     // Start large
	    Animated.spring(                          // Base: spring, decay, timing
	      this.state.heartScale,                 // Animate `bounceValue`
	      {
	        toValue: 1,                         // Animate to smaller size
	      }
	    ).start();                                // Start the animation
	},
	_closeModal(){
		this.setState({
			isModalOpen:false
		})
		this._cancelAnimatedHeart();
	},
	_showConfirm(){
		var confirm = this._renderConfirm();
		RCTDeviceEventEmitter.emit('showConfirm',confirm);
	},
	_hideConfirm(){
		RCTDeviceEventEmitter.emit('hideConfirm');
	},
	_renderConfirm(){
	  return (
	    <ConfirmList closeModal={this._hideConfirm} _confirm={this._confirm}/>
	    )
	},
	_renderModal(){
		var enter = {
			transform:[{translateY:this.state.translateY}]
		}
		var container = (<ScrollView
		  contentContainerStyle={styles.contentContainer}
		  style={styles.scrollView}>
		  <TouchableOpacity onPress={this._showConfirm}>
		  <Image style={styles.image} source={getImage.authorAvatar()} />
		  </TouchableOpacity>
		  <Image style={styles.image} source={getImage.authorAvatar()} />
		  <Image style={styles.image} source={getImage.authorAvatar()} />
		  <Image style={styles.image} source={getImage.authorAvatar()} />
		</ScrollView>);
		return (
			<View>
			<ModalWithBlur style={{top:100}} closeModal={this._closeModal} modalContainer={container}/>
			<ModalWithAnimated.Tips >
			<Text style={styles.tips}>{"xhangdf"}</Text>
			</ModalWithAnimated.Tips>
			</View>
			)
	},
	render(){
		var heart = {
		    transform: [{scaleX: this.state.heartScale}, {scaleY: this.state.heartScale}],
		}
		return (
			<View style={[styles.container,styles.blankView]}>
			<Animated.View style={heart}>
			<View style={styles.container}>
				<ListView contentContainerStyle={styles.list}
				          dataSource={this.state.dataSource}
				          renderRow={this._renderRow}
				        />
	        </View>
			</Animated.View>
			{this.state.isModalOpen ? this._renderModal():null}
			</View>
		)
	}
})

var styles = StyleSheet.create({

    	blankView:{
    		backgroundColor: "transparent",
    	},
    	container:{
    		flex:1,
    		width:screen.width,
    		height: screen.height,
    		position:"absolute",
    		backgroundColor:"transparent",
    		left:0,
    		top:0,
    	},
    	clickedView:{
    		width:screen.width,
    		height: 100,
    		position:"absolute",
    		top:0,
    	},
        list: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        item: {
            backgroundColor: 'red',
            margin: 3,
            width: 100
        },
        cellImage: {
          height: 300,
          width: screen.width,
          backgroundColor: "transparent",
          resizeMode: "cover"
        },
        blur:{
        	width:screen.width,
        	height: screen.height,
        	position:"absolute",
        	opacity:0.8
        },
        modalView: {
          width:screen.width,
          height: screen.height,
          position:"relative",
          backgroundColor:"transparent",
        },
        image:{
        	width:screen.width,
        	height:screen.height/3,
        },
        ImageView:{
        	width:screen.width,
        	height:screen.height-100,
        	backgroundColor:"#fff",
        	top:100,
        },
        tips:{
        	alignItems:"center",
        	color:"#fff",
        	textAlign:"center"

        },
        modalContainer:{
        	flex: 1,
        	width:screen.width,
        	height:screen.height-100,
        	backgroundColor:"#fff",
        	opacity:1,
        	top:100,
        	position:"absolute",
        },
        scrollView:{
        	backgroundColor:"#fff",
        	flex:1
        }
});

module.exports = Test