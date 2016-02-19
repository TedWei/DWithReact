"use strict";

var React = require("react-native");
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicatorIOS,
  View,
  ListView,
  Component,
  Dimensions,
  Modal,
  Animated,
} = React;

var api = require("../components/api");

var Icon = require("react-native-vector-icons/FontAwesome"),
    getImage = require("../components/getImage"),
    HTML = require("react-native-htmlview"),
    screen = Dimensions.get('window'),
    ParallaxView = require("react-native-parallax-view"),
    rebound = require('rebound');

var Player = require("./Player"),
    CommentItem = require("./CommentItem"),
    Shot = require("../model/Shot"),
    Comment = require("../model/Comment"),
    Loading = require("../components/Loading");

var ShotDetails = React.createClass({
  getInitialState: function() {
    return {
      isLoading: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      heartScale:new Animated.Value(1),
      liked:false,
      likes_count:this.props.shot.likes_count,
    };
  },
  componentWillMount(){
  },
  componentDidMount: function() {
    this.checkLiked();
    var shot =new Shot(this.props.shot);
    shot.getComment().then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        isLoading: false
      });
      return responseData;
    }).then((responseData)=>{
      responseData.map(function(elem, index) {
        let comment = new Comment(shot.id,elem);
        comment.getLikes().then((responseData)=>{
        }).done()
      })
    }).done();
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
  checkLiked(){
    var _that=this;
    var shot =new Shot(this.props.shot);
    shot.isLike().then((isLike)=>{
      if (isLike){
        _that.setState({
          liked:true,
        })
      }
    })
  },
  like(){
    var shot =new Shot(this.props.shot);
    var isLike = this.state.liked;
    // shot.isLike().then((isLike)=>{
      if (isLike){
        shot.unlike().then((unliked)=>{
          if (unliked){
            this._renderUnlike();
          }else{
            this._renderLike();
          }
        })
      }else{
        shot.like().then((liked)=>{
          if (liked){
            this._renderLike();
          }else{
            this._renderUnlike();
          }
        })
      }
    // })
  },
  _renderUnlike(){
    this.setState({
      likes_count:this.state.likes_count-1,
      liked:false,
    })
    this._animatedHeart();
  },
  _renderLike(){
    this.setState({
      likes_count:this.state.likes_count+1,
      liked:true,
    })
    this._animatedHeart();
  },
  render: function() {
    var player = this.props.shot.user,
        shot= this.props.shot;
    var heart = {
        transform: [{scaleX: this.state.heartScale}, {scaleY: this.state.heartScale}],
    }
    return (
      <ScrollView
        style={styles.scrollView}>
        <View style={styles.container}>
          <Image source={getImage.shotImage(this.props.shot)} style={styles.imageView} />
          <View style={styles.headerContent}>
              <View style={styles.avatarAndMore}>
              <Image source={getImage.authorAvatar(player)}
                     style={styles.playerAvatar} />
              <Text style={styles.shotTitle}>{this.props.shot.title}</Text>
              <Text style={styles.playerContent}>by <Text style={styles.player}>{player.name}</Text></Text>
              </View>
              <View style={styles.shotDetailsRow}>
                <View style={[styles.shotCounter]}>
                <TouchableHighlight style={styles.invisibleTouch}
                                onPress={this.like.bind(this,shot)}
                                underlayColor={"#fff"}
                                activeOpacity={0.95}>
                  <Animated.View style={heart}><Icon name={this.state.liked ? "heart" : "heart-o"} size={16} color={this.state.liked ?"#ea4c89":"#333"}/></Animated.View>
                  </TouchableHighlight>
                  <Text style={styles.shotCounterText}> {this.state.likes_count} </Text>
                </View>
                <View style={styles.shotCounter}>
                  <Icon name="comments-o" size={16} color="#333"/>
                  <Text style={styles.shotCounterText}> {this.props.shot.comments_count} </Text>
                </View>
                <View style={styles.shotCounter}>
                  <Icon name="eye" size={16} color="#333"/>
                  <Text style={styles.shotCounterText}> {this.props.shot.views_count} </Text>
                </View>
              </View>
          </View>
          <View style={styles.mainSection}>
          <View style={styles.separator} />
            <Text>
              <HTML value={this.props.shot.description}
                    stylesheet={styles}/>
            </Text>
            <View>
              {this.state.dataSource.getRowCount() === 0 ?
                <Loading /> :
                this._renderCommentsList()}
            </View>
          </View>
        </View>
        </ScrollView>
    );
  },

  _showModalTransition: function(transition) {
    transition("opacity", {
      duration: 200,
      begin: 0,
      end: 1
    });
    transition("height", {
      duration: 200,
      begin: - screen.height * 2,
      end: screen.height
    });
  },

  _hideModalTransition: function(transition) {
    transition("height", {
      duration: 200,
      begin: screen.height,
      end: screen.height * 2,
      reset: true
    });
    transition("opacity", {
      duration: 200,
      begin: 1,
      end: 0
    });
  },

  selectPlayer: function(player: Object) {
    console.log(player)
    // this.props.navigator.push({
    //   component: Player,
    //   passProps: {player},
    //   title: player.name
    // });
  },

  _renderCommentsList: function() {
    return <View style={styles.sectionSpacing}>
      <View style={styles.separator} />
      <Text style={styles.heading}>Comments</Text>
      <View style={styles.separator} />
      <ListView
        ref="commentsView"
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
      />
    </View>
  },

  renderRow: function(comment: Object) {
    return <CommentItem
      onSelect={() => this.selectPlayer(comment.user)}
      comment={comment} />;
  },

  _renderLoading: function() {
    return <ActivityIndicatorIOS animating={this.state.isLoading}
                                 style={styles.spinner}/>;
  }
});

var styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff",
    height:screen.height,
    width:screen.width,
  },
  spinner: {
    marginTop: 20,
    width: 50
  },
  a: {
    fontWeight: "300",
    color: "#ea4c89"
  },
  p: {
    marginBottom: 0,
    flexDirection: "row",
    marginTop: 0,
  },
  imageView:{
    width:screen.width,
    height:screen.height/3,
  },
  invisibleView: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right:0
  },
  customModalImage: {
    height: screen.height / 2
  },
  headerContent: {
    flex: 1,
    // alignItems: "center",
    width: screen.width,
    backgroundColor: "#fff",
    position:"relative",
  },
  avatarAndMore:{
    // position:"absolute",
    // bottom:-10,
    left:30,
  },
  shotTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#ea4c89",
    lineHeight: 18
  },
  playerContent: {
    fontSize: 12
  },
  player: {
    fontWeight: "900",
    lineHeight: 18
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: "#fff",
    marginTop:-20,
    borderRadius: 20,
    backgroundColor:"#fff"
  },
  rightPane: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  shotDetailsRow: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width:screen.width/3,
    position:"absolute",
    // bottom:-10,
    right:10,
    top:10,
  },
  shotCounter: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor:"transparent"
  },
  shotCounterText: {
    color: "#333"
  },
  mainSection: {
    flex: 1,
    alignItems: "stretch",
    padding: 10,
    backgroundColor: "white"
  },
  separator: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },
  sectionSpacing: {
    marginTop: 20
  },
  heading: {
    fontWeight: "700",
    fontSize: 16
  }
});

module.exports = ShotDetails;
