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
	      return {
	        isModalOpen:true,
	      };
	},
	closeModal(){
		this.props.closeModal()
		// this._cancelAnimatedHeart();
	},
	render(){
		return (
			<View style={[styles.container,styles.blankView]}>
			  <View style={styles.modalView}>
			  <BlurView blurType="dark" style={styles.blur}>
			  </BlurView>
			  <TouchableOpacity onPress={this.closeModal}>
			  <View style={styles.clickedView}></View>
			  </TouchableOpacity>
			  <Modal style={styles.modalContainer} visible={this.state.isModalOpen} animated={true}>
			  <Responder swiperLeft={this.closeModal} swiperRight={this.closeModal}>
			  {this.props.modalContainer}
			  </Responder>
			  </Modal>
			  </View>
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
		left:0,
		top:0,
	},
	clickedView:{
		width:screen.width,
		height: 100,
		position:"absolute",
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
    },
    modalContainer:{
    	flex: 1,
    	width:screen.width,
    	height:screen.height-100,
    	top:100,
    	opacity:1,
    	backgroundColor:"transparent",
    	overflow:"hidden",
    }
});

module.exports = Test