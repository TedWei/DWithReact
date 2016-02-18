import React,{
	Modal,
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
	Dimensions,
	Image,
} from 'react-native'


var ShotDetail = require('./ShotDetail'),
    screen = Dimensions.get("window");
const {BlurView,VibrancyView} = require("react-native-blur");


var ShotDetailWithModal = React.createClass({
	getInitialState(){
		return {
			isModalOpen:true
		}
	},
	closeModal(){
		this.setState({
			isModalOpen:false
		})
		this.props.closeModal(true);
	},
	render(){
		return (
			<Modal transparent={true} visible={this.state.isModalOpen} animated={true} >
			<TouchableOpacity onPress={this.closeModal}>
			  <View style={styles.playerImageModal}>
			  <BlurView blurType="light" style={styles.blur}>
			  </BlurView>
			  <View style={styles.modalContainer}>
			  <ShotDetail shot={this.props.shot} />
			  </View>
			  </View>
			  </TouchableOpacity>
			</Modal>
			)
	}
})

var styles =StyleSheet.create({
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
})


module.exports=ShotDetailWithModal