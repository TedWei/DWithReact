import React,{
	Animated,
	StyleSheet,
} from 'react-native'

var ModalWithAnimated = require("./ModalWithAnimated")

class Tips extends ModalWithAnimated {
	constructor(props){
		super(props);
		this.state = {
		 	translateY:new Animated.Value(0)
		}
	}
	_enter(){
	    this.state.translateY.setValue(0);
	    Animated.spring(
	      this.state.translateY,
	      {
	        toValue: 64,
	        friction: 8
	      }
	    ).start();
	}
	render(){
		return (
			<ModalWithAnimated style={styles.tips}/>
			)
	}
}



const styles = StyleSheet.create({
	tips:{
		height:64,
		top:0,
	}
})


module.exports = Tips;