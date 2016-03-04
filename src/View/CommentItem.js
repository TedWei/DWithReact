"use strict";

var React = require("react-native");
var {
  Image,
  StyleSheet,
  PixelRatio,
  Text,
  TouchableHighlight,
  View,
  Component,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
} = React;

var Icon = require("react-native-vector-icons/FontAwesome"),
    getImage = require("../components/getImage"),
    Comment = require("../model/Comment"),
    HTML = require("react-native-htmlview"),
    screen = Dimensions.get('window');

var CommentItem = React.createClass({
  getDefaultProps: function() {
    return {
      comments: [],
    }
  },
  getInitialState(){
    return {
      liked:false,
      commenting:false,
      likes:[],
      heartScale:new Animated.Value(1),
      likes_count:this.props.comment.likes_count,
      opacity:new Animated.Value(1),
    }
  },
  componentWillMount(){
  },
  componentDidMount(){
    this.checkLiked();
    this.getLikes();
  },
  componentWillUnmount(){
    this.state.opacity.setValue(1);
    Animated.timing(
      this.state.opacity,
      {
        toValue: 0,
        duration:1000,
      }
    ).start();
  },
  checkLiked(){
    var _that=this;
    let comment = new Comment(this.props.shot.id,this.props.comment);
    comment.isLike().then((isLike)=>{
      if (isLike){
        _that.setState({
          liked:true
        })
      }
    })
  },
  getLikes(){
    var _that=this;
    let comment = new Comment(this.props.shot.id,this.props.comment);
    comment.getLikes().then((responseDate)=>{
      _that.setState({
        likes:responseDate
      })
    })
  },
  _animatedHeart(){
      this.state.heartScale.setValue(1.5);     // Start large
      Animated.spring(                          // Base: spring, decay, timing
        this.state.heartScale,                 // Animate `bounceValue`
        {
          toValue: 1,                         // Animate to smaller size
          friction: 1,                          // Bouncier spring
        }
      ).start();                                // Start the animation
  },
  _renderUnlike(){
    this.setState({
      likes_count:this.state.likes_count-1,
      liked:false,
    })
    this._animatedHeart();
    this.getLikes();
  },
  _renderLike(){
    this.setState({
      likes_count:this.state.likes_count+1,
      liked:true,
    })
    this._animatedHeart();
    this.getLikes();
  },
  like(){
    var comment = new Comment(this.props.shot.id,this.props.comment);
    var isLike = this.state.liked;
      if (isLike){
        comment.unlike().then((unliked)=>{
          if (unliked){
            this._renderUnlike();
          }else{
            this._renderLike();
          }
        })
      }else{
        comment.like().then((liked)=>{
          if (liked){
            this._renderLike();
          }else{
            this._renderUnlike();
          }
        })
      }
  },
  _replyComment(){
    this.setState({
      commenting:true,
    })
  },
  _renderComment(){

  },
  render: function() {
    var createLikes = function(elem){
      return (<Image key={elem.id} source={getImage.authorAvatar(elem.user)}
                     style={styles.smallAvatar}/>)
    }
    var heart = {
        transform: [{scaleX: this.state.heartScale}, {scaleY: this.state.heartScale}],
    }
    return (<Animated.View style={{opacity:this.state.opacity}}>
      <TouchableWithoutFeedback underlayColor={"#f3f3f3"} onPress={()=>{this.props.onSelect("reply")}} onLongPress={()=>{this.props.onSelect("delete")}}>
        <View>
          <View style={styles.commentContent}>
          <TouchableOpacity onPress={()=>{this.props.onSelect("player")}} underlayColor={"#f3f3f3"}>
          <Image source={getImage.authorAvatar(this.props.comment.user)}
                     style={styles.avatar}/>
          </TouchableOpacity>
            <View style={styles.commentBody}>
            <TouchableOpacity onPress={()=>{
              this.props.onSelect("player")
            }} underlayColor={"#f3f3f3"}>
              <Text style={styles.userName}>
                {this.props.comment.user.name}
              </Text>
              </TouchableOpacity>
              <Text style={styles.commentText}>
                <HTML value={this.props.comment.body} />
              </Text>
            </View>
          </View>
          <View style={styles.comment_likes_content}>
              <View style={styles.comment_likes}>
              {this.state.likes.map(createLikes)}
              </View>
              <View style={styles.like}>
              <TouchableOpacity style={styles.invisibleTouch}
                              onPress={this.like}
                              underlayColor={"#fff"}
                              activeOpacity={0.95}>
                <Animated.View style={heart}><Icon name={this.state.liked ? "heart" : "heart-o"} size={16} color={this.state.liked ?"#ea4c89":"#333"}/></Animated.View>
                </TouchableOpacity>
                <Text style={styles.shotCounterText}> {this.state.likes_count} </Text>
              </View>
          </View>
          <View style={styles.cellBorder} />
        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
      );
  }
});

var styles = StyleSheet.create({
  commentContent: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    position:"relative"
  },
  userName: {
    fontWeight: "400",
    color:"blue"
  },
  commentBody: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  commentText: {
    flex: 1,
    flexDirection: "row"
  },
  cellBorder: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  },
  comment_likes_content:{
    paddingLeft: 10,
    paddingRight:10,
    flex: 1,
    flexDirection: "row",
  },
  comment_likes:{
    flex:1,
    flexDirection:"row",
    justifyContent:"flex-end",
  },
  like:{
    alignItems: "center",
    justifyContent: "space-between",
  },
  smallAvatar:{
    borderRadius: 10,
    width: 20,
    height: 20,
    marginRight: 10
  },
});

module.exports = CommentItem;
