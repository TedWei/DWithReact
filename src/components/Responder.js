import React,{
	View,
	PanResponder,
	StyleSheet,
	Animated,
	Easing,
	Dimensions,
} from 'react-native'

var TIMES = 400,
	maxRotate = 45,
	maxTranslatedY = 50,
	maxProportion = 0.3,
	screen = Dimensions.get("window"),
	utils = require('./utils');

var ResponderView = React.createClass({
	_panResponder:{},
	_position:{},
	getInitialState(){
		return {
			translateX:new Animated.Value(0),
			translateY:new Animated.Value(0),
			rotate:new Animated.Value(0),
		};
	},
	componentWillMount: function() {
	   this._panResponder = PanResponder.create({
	     onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
	     onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
	     onPanResponderGrant: this._handlePanResponderGrant,
	     onPanResponderMove: this._handlePanResponderMove,
	     onPanResponderRelease: this._handlePanResponderEnd,
	     onPanResponderTerminate: this._handlePanResponderEnd,
	   });
	 },

	 componentDidMount: function() {
	   // this._animate();
	 },

	 _handlePan(evt){
	 },
	 _updatePosition(){

	 },
	 render: function() {
	 	var scale = {
	 	    transform: [{translateX:this.state.translateX},{translateY:this.state.translateY},{rotate:this.state.rotate.interpolate({
	 	    	inputRange:[-360,360],
	 	    	outputRange:['-360deg','360deg']
	 	    })}],
	 	}
	   return (
	     <View
	       style={styles.container}>
	       <Animated.View style={scale} ref="animated">
	       		<View {...this.props} {...this._panResponder.panHandlers}
	       />
	       </Animated.View>
	     </View>
	   );
	 },
	 _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
	    // Should we become active when the user presses down on the circle?
	    return true;
	  },

	  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
	    // Should we become active when the user moves a touch over the circle?
	    return true;
	  },
	  _handlePanEnd(ges){
	  	if (ges.moveX === 0 && ges.moveY === 0 ){
	  		this._clickEvent();
	  	}
	  	var proportion = ges.dx/screen.width;
	  	if (proportion > maxProportion){
	  		this._swiperLeftEvent();
	  	}else if(proportion< -maxProportion){
	  		this._swiperRightEvent();
	  	}else{
	  		this._animateBack();
	  	}
	  },
	  _handleSwiper(ges){
	  	this._animate(ges.dx);
	  },
	  _clickEvent(){
	  	console.log("clicked");
	  },
	  _animate(dx) {
	  	this._translate(dx);
	  	this._rorate(dx);
	   },
	   _translate(dx){
	   	Animated.timing(this.state.translateX, {
	   	  toValue: dx,
	   	  ease:"linear",
	   	}).start();
	   	var proportion = dx/screen.width;
	   	var value = -utils.abs(proportion)*maxTranslatedY;
	   	Animated.timing(this.state.translateY, {
	   	  toValue: value,
	   	  ease:"linear",
	   	}).start();
	   },
	   _rorate(dx){
	   	var value = (dx/screen.width)*maxRotate;
	   	Animated.timing(this.state.rotate, {
	   	  toValue: value,
	   	  ease:"linear",
	   	}).start();
	   },
	   _animateBack(){
	   	Animated.spring(this.state.rotate, {
	   	  toValue: 0,
	   	  ease:"linear",
	   	}).start();
	   	Animated.spring(this.state.translateX, {
	   	  toValue: 0,
	   	  ease:"linear",
	   	}).start();
	   	Animated.spring(this.state.translateY, {
	   	  toValue: 0,
	   	  ease:"linear",
	   	}).start();
	   },
	  _swiperLeftEvent(){
	  	this.props.swiperLeft();
	  },
	  _swiperRightEvent(){
	  	this.props.swiperRight();
	  },
	  _updatePosition(gestureState){

	  },
	  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
	  },
	  _handlePanResponderMove: function(e: Object, gestureState: Object) {
	    this._handleSwiper(gestureState)
	  },
	  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
	  	this._handlePanEnd(gestureState)
	  },
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

module.exports = ResponderView