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
	_renderModal(){
		return (
			<Modal transparent={true} visible={this.state.isModalOpen} animated={true} >
			<TouchableOpacity onPress={this.closeModal}>
			  <View style={styles.playerImageModal}>
			  <BlurView blurType="dark" style={styles.blur}>
			  </BlurView>
			  <View style={styles.modalContainer}>
			  {this.props.modalContainer}
			  </View>
			  </View>
			  </TouchableOpacity>
			</Modal>
			)
	},
	render(){
		return (
			<View style={[styles.container,styles.blankView]}>
			<View style={styles.container}>
	        </View>
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
    modalContainer:{
    	flex: 1,
    	backgroundColor:"#fff",
    	width:screen.width,
    	height:screen.height-100,
    	top:100,
    	opacity:1
    }
});

module.exports = Test