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
} from 'react-native'

var getImage = require("../components/getImage"),
	screen=Dimensions.get('window'),
	Responder = require("../components/Responder"),
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
	},
	_closeRow(bool){
		if (bool){
			this.setState({
				selected:false
			})
		}
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
	closeModal(){
		this.setState({
			isModalOpen:false
		})
		this._cancelAnimatedHeart();
	},
	_renderModal(){
		return (
			<Modal transparent={true} visible={this.state.isModalOpen} animated={true} >
			  <View style={styles.playerImageModal}>
			  <BlurView blurType="light" style={styles.blur}>
			  </BlurView>
			  <TouchableOpacity onPress={this.closeModal}>
			  <View style={styles.clickedView}></View>
			  </TouchableOpacity>
			  <Responder swiperLeft={this.closeModal} swiperRight={this.closeModal}>
			  <View style={styles.modalContainer}>
			  <Image style={styles.image} source={getImage.authorAvatar()} />
			  </View>
			  </Responder>
			  </View>
			</Modal>
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
		backgroundColor:"#000"
	},
	container:{
		flex:1,
		width:screen.width,
		height: screen.height,
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
    playerImageModal: {
      width:screen.width,
      height: screen.height,
    },
    image:{
    	width:screen.width,
    	height:screen.height/3,
    },
    modalContainer:{
    	flex: 1,
    	backgroundColor:"#fff",
    	width:screen.width,
    	height:screen.height-100,
    	top:100,
    	opacity:1
    },
    clickedView:{
    	width:screen.width,
    	height:100,
    	position:"absolute",
    },
});

module.exports = Test