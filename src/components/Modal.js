import React,{
	Animated,
	View,
	StyleSheet,
	Dimensions,
	Component,
	Text,
} from 'react-native'

var screen = Dimensions.get('window');

const {BlurView,VibrancyView} = require("react-native-blur");

class ModalWithAnimated extends Component {
	constructor(props){
		super(props);
		this.state = {
		 	translateY:new Animated.Value(0),
		}
	}
	componentDidMount(){
		this._enter();
	}
	_enter(){
	    this.state.translateY.setValue(screen.height);
	    Animated.spring(
	      this.state.translateY,
	      {
	        toValue: 0,
	        friction: 8
	      }
	    ).start();
	}
	render(){
		var enter = {
			transform:[{translateY:this.state.translateY}]
		}
		return (
			<BlurView blurType="dark" style={styles.blur}>
			<Animated.View style={[styles.container,enter]} >
			<View {...this.props} />
			</Animated.View>
			</BlurView>
			)
	}
}



class Tips extends ModalWithAnimated {
	constructor(props){
		super(props);
		this.state = {
		 	translateY:new Animated.Value(0),
		}
	}
	componentDidMount(){
		this._enter();
	}
	_enter(){
	    this.state.translateY.setValue(-64);
	    Animated.spring(
	      this.state.translateY,
	      {
	        toValue: 0,
	        friction: 10
	      }
	    ).start(this._hideView.bind(this));
	}
	_hideView(){
		Animated.spring(
		  this.state.translateY,
		  {
		    toValue: -64,
		    friction: 10
		  }
		).start(this._setCallback.bind(this));
	}
	_setCallback(){
		console.log("tips hidden")
		// this.props.callback();
	}
	render(){
		var enter = {
			transform:[{translateY:this.state.translateY}]
		}
		return (
			<Animated.View style={[styles.tips,enter,this.props.style]} >
			<View {...this.props} />
			</Animated.View>
			)
	}
}




const styles = StyleSheet.create({
	container:{
		backgroundColor:"#fff",
	},
	tips:{
		flex:1,
		width:screen.width,
		height:48,
		paddingTop:20,
		top:0,
		position:"absolute",
		backgroundColor:"#ea4c89",
	},
})

module.exports = {
	Modal:ModalWithAnimated,
	Tips:Tips
};