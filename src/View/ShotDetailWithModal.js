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
			<View style={styles.modal}>
			<Modal transparent={true} visible={this.state.isModalOpen} animated={true} >
			<TouchableOpacity onPress={this.closeModal}>
			  <View style={styles.playerImageModal}>
			  <View style={styles.modalContainer}>
			  <ShotDetail shot={this.props.shot} />
			  </View>
			  </View>
			  </TouchableOpacity>
			</Modal>
			</View>
			)
	}
})

var styles =StyleSheet.create({
	modal:{
		backgroundColor:"rgba(0,0,0,0.5)"
	},
	playerImageModal: {
	  width:screen.width,
	  height: screen.height,
	  backgroundColor:"rgba(0,0,0,0.5)"
	},
	modalContainer:{
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor:"#fff",
		width:screen.width,
		height:screen.height-100,
		top:100
	},
	modalImage:{
	  width:screen.width * 0.8,
	  resizeMode: "contain",
	  height: screen.height / 3,
	}
})


module.exports=ShotDetailWithModal