import React,{
	Animated,
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Component,
	Dimensions,
} from 'react-native'

const screen = Dimensions.get("window");

class ConfirmList extends Component {
	constructor(props){
		super(props);
		this.state = {
		 	translateY:new Animated.Value(0),
		}
	}
	getInitialState(){
		return {
			cancelTitle:"取消",
			confirmTitle:"确定",
		}
	}
	componentWillMount(){
		console.log("show")
	}
	componentDidMount(){
		// this.state.heartScale.setValue(1.5);
		// Animated.spring(
		//   this.state.heartScale,
		//   {
		//     toValue: 1,
		//     friction: 1,
		//   }
		// ).start();
	}
	render(){
		return (
			<View style={styles.list}>
			    <View style={styles.title}><Text></Text></View>
			    <View style={styles.button}><TouchableOpacity onPress={()=>{}} ><Text>{this.state.confirmTitle}</Text></TouchableOpacity></View>
			    <View style={styles.button}><TouchableOpacity onPress={()=>{}} ><Text>{this.state.cancelTitle}</Text></TouchableOpacity></View>
			</View>
			)
	}
}

const style = StyleSheet.create({
	list:{
		flex:1,
		flexDirection: "column",
		alignItems: "flex-start",
		position:"absolute",
		bottom:0,
		top:0,
		width:screen.width,
		height:screen.height
	},
	button:{
		alignItems:"center",
		justifyContent:"center"
	}
})

module.exports = ConfirmList