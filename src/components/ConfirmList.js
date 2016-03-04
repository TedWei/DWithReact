import React,{
	Animated,
	View,
	StyleSheet,
	Text,
	PixelRatio,
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
		 	cancelTitle:this.props.cancelTitle || "取消",
		 	confirmTitle:this.props.confirmTitle || "确定",
		 	title:this.props.title || "确定执行此操作吗？"
		}
	}
	componentDidMount(){
	}
	_confirm(){
		this.props.confirm();
	}
	_cancel(){
		this.props.closeModal();
	}
	render(){
		return (
			<View style={styles.list}>
			    <View style={styles.title}><Text style={{color:"#ea4c89"}}>{this.state.title}</Text></View>
			    <View style={styles.button}><TouchableOpacity onPress={()=>{this._confirm()}}><Text style={{color:"#fff"}}>{this.state.confirmTitle}</Text></TouchableOpacity></View>
			    <View style={styles.cellBorder} />
			    <View style={styles.button}><TouchableOpacity onPress={()=>{this._cancel()}}><Text style={{color:"#fff"}}>{this.state.cancelTitle}</Text></TouchableOpacity></View>
			</View>
			)
	}
}

const styles = StyleSheet.create({
	list:{
		flex:1,
		flexDirection: "column",
		alignItems: "flex-end",
		justifyContent: "center",
		position:"absolute",
		bottom:0,
		top:0,
		width:screen.width,
		height:screen.height,
	},
	title:{
		width:screen.width,
		// height:40,
		alignItems:"center",
		justifyContent:"center",
	},
	button:{
		width:screen.width,
		height:40,
		alignItems:"center",
		justifyContent:"center",
	},
	cellBorder: {
	  backgroundColor: "rgba(255, 255, 255, 0.2)",
	  height: 1 / PixelRatio.get(),
	  width:screen.width-20,
	  marginLeft: 10,
	  marginRight: 10,
	},
})

module.exports = ConfirmList