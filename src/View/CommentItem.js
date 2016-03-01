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
  Dimensions
} = React;

var Icon = require("react-native-vector-icons/FontAwesome"),
    getImage = require("../components/getImage"),
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
    }
  },
  componentWillMount(){
  },
  componentDidMount(){
    this.checkLiked();
  },
  checkLiked(){
    var _that=this;
        var comment = new Comment(this.props.shot.id,this.props.comment);
        comment.isLike().then((isLike)=>{
          if (isLiked){
            _that.setState({
              liked:true
            })
          }
        })
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
    return <View>
      <TouchableHighlight underlayColor={"#f3f3f3"}>
        <View>
          <View style={styles.commentContent}>
          <TouchableHighlight onPress={this.props.onSelect.bind(this, this.props.comment)} underlayColor={"#f3f3f3"}>
              <Image source={getImage.authorAvatar(this.props.comment.user)}
                     style={styles.avatar}/>
                     </TouchableHighlight>
            <View style={styles.commentBody}>
            <TouchableHighlight onPress={this.props.onSelect.bind(this, this.props.comment)} underlayColor={"#f3f3f3"}>
              <Text style={styles.userName}>
                {this.props.comment.user.name}
              </Text>
              </TouchableHighlight>
              <Text style={styles.commentText}>
                <HTML value={this.props.comment.body} />
              </Text>
            </View>
          </View>
          <View style={styles.cellBorder} />
        </View>
      </TouchableHighlight>
    </View>;
  }
});

var styles = StyleSheet.create({
  commentContent: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  userName: {
    fontWeight: "700"
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
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  }
});

module.exports = CommentItem;
