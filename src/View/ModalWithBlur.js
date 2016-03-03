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
	ModalWithAnimated = require("../components/Modal"),
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
	},
	componentWillMount(){
		console.log(this)
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
			  <View style={styles.responder} >
			  <Responder swiperLeft={this.closeModal} swiperRight={this.closeModal}>
			  <ModalWithAnimated.Modal style={styles.modalContainer}>
			  {this.props.modalContainer}
			  </ModalWithAnimated.Modal>
			  </Responder>
			  </View>
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
		height: screen.height,
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
    },
    responder:{
    	flex: 1,
    	width:screen.width,
    	height:screen.height-100,
    	top:100,
    	position:"absolute",
    	opacity:1,
    	backgroundColor:"transparent",
    	overflow:"hidden",
    },
    modalContainer:{
    	flex: 1,
    	width:screen.width,
    	height:screen.height-100,
    	backgroundColor:"transparent",
    }
});

module.exports = Test