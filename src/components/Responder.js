import React,{
	View,
	PanResponder,
	StyleSheet,
	Animated,
	Easing,
	Dimensions,
} from 'react-native'

var SWIPE_THRESHOLD = 120,
    edge =40,
	screen = Dimensions.get("window"),
	clamp = require('clamp')
	utils = require('./utils');

var Responder = React.createClass({
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

		function checkIfVerticalMove(ges){
			if(Math.abs(ges.dx) < edge ){
				return true;
			}
			return false;
		}

	   this._panResponder = PanResponder.create({
	     onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
	     onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
	     onPanResponderTerminationRequest:()=>true,
	     onMoveShouldSetPanResponderCapture:this._handleMoveShouldSetPanResponderCapture,
	     onPanResponderGrant:(e,gestureState)=>{
	     	if (gestureState.x0 < edge || gestureState.x0 > screen.width-edge && !checkIfVerticalMove(gestureState)){
	     		this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
	     		this.state.pan.setValue({x: 0, y: 0});
	 		return true;
	 		}
		     return false;
	     },
	    onPanResponderMove:(event, gestureState) => {
	    	if (gestureState.x0 < edge || gestureState.x0 > screen.width-edge && !checkIfVerticalMove(gestureState)){
	    	this.state.pan.setValue({x: gestureState.dx, y: gestureState.dy});
	    	}
	    },
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
	 render: function() {
	 	let { pan, enter, } = this.state;
	 	let [translateX, translateY] = [pan.x, pan.y];
	 	let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
	 	var scale = {
	 	    transform: [{translateX},{rotate}],
	 	    backgroundColor:"transparent"
	 	}
	   return (
	       <Animated.View style={scale} ref="animated" {...this._panResponder.panHandlers}>
	       		<View {...this.props}  />
	       </Animated.View>
	   );
	 },
	 _checkInEdge:function(gestureState:Object):Boolean{
	    	if (gestureState.x0 < edge || gestureState.x0 > screen.width-edge){
	    		return true;
	    	}
	       return false;
	 },
	 _handleStartShouldSetPanResponder: function(e: Object, gestureState: Object): Boolean {
	 	return false;
	  },
	  _handleMoveShouldSetPanResponder: function(e: Object, gestureState: Object): Boolean {
	  		if ( ((gestureState.moveX -gestureState.dx) < edge) || ((gestureState.moveX - gestureState.dx) > screen.width-edge)){
	  			return true;
	  		}
	  	   return false;
	  },
	  _handleMoveShouldSetPanResponderCapture:function(e: Object, gestureState: Object): Boolean {
	  	this._checkInEdge(gestureState)
	  },
	  _swiperLeftEvent(){
	  	this.props.swiperLeft();
	  },
	  _swiperRightEvent(){
	  	this.props.swiperRight();
	  },
	  _notSwiperEvent(){
	  	// this.props.isNotSwiper();
	  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"transparent",
  },
});

module.exports = Responder