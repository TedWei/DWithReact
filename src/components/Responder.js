import React,{
	View,
	PanResponder,
	StyleSheet,
	Animated,
	Easing,
	Dimensions,
} from 'react-native'

var SWIPE_THRESHOLD = 120,
	screen = Dimensions.get("window"),
	clamp = require('clamp')
	utils = require('./utils');

var ResponderView = React.createClass({
	_panResponder:{},
	_position:{},
	getInitialState(){
		return {
			pan:new Animated.ValueXY(),
			translateX:new Animated.Value(0),
			translateY:new Animated.Value(0),
			rotate:new Animated.Value(0),
		};
	},
	componentWillMount: function() {

	   this._panResponder = PanResponder.create({
	     onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
	     onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
	     onPanResponderGrant:(e)=>{
	     	this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
	     	this.state.pan.setValue({x: 0, y: 0});

	     },
	    onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      	]),
	     onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        var velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
         var event =  velocity < 0 ?this._swiperLeftEvent:this._swiperRightEvent
          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(event)
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }});
	 },

	 componentDidMount: function() {
	 },

	 _handlePan(evt){
	 },
	 _updatePosition(){

	 },
	 render: function() {
	 	let { pan, enter, } = this.state;
	 	let [translateX, translateY] = [pan.x, pan.y];
	 	let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
	 	var scale = {
	 	    transform: [{translateX},{translateY},{rotate}],
	 	    backgroundColor:"transparent"
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
	    return true;
	  },

	  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): boolean {
	    return true;
	  },
	  _handlePanEnd(ges){
	  	var proportion = ges.dx/screen.width;
	  	if (proportion > maxProportion){
	  		this._swiperLeftEvent();
	  	}else if(proportion< -maxProportion){
	  		this._swiperRightEvent();
	  	}else{
	  		this._animateBack();
	  	}
	  },
	   _animateBack(){
	   	Animated.spring(this.state.rotate, {
	   	  toValue: 0,
	   	  ease:"linear",
	   	  delay:delay,
	   	}).start();
	   	Animated.spring(this.state.translateX, {
	   	  toValue: 0,
	   	  ease:"linear",
	   	  delay:delay,
	   	}).start();
	   	Animated.spring(this.state.translateY, {
	   	  toValue: 0,
	   	  ease:"linear",
	   	  delay:delay,
	   	}).start();
	   },
	  _swiperLeftEvent(){
	  	this.props.swiperLeft();
	  },
	  _swiperRightEvent(){
	  	this.props.swiperRight();
	  },
	  _handlePanResponderGrant: function(e: Object, gestureState: Object) {
	  	this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
	  	this.state.pan.setValue({x: 0, y: 0});
	  },
	  _handlePanResponderEnd: function(e: Object, gestureState: Object) {
	  	this._handlePanEnd(gestureState)
	  },
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"transparent"
  },
});

module.exports = ResponderView