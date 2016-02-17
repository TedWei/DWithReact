"use strict";

var React = require("react-native");
var {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Component,
  ActivityIndicatorIOS,
  ListView,
  Dimensions,
  Modal
} = React;

var Icon = require("react-native-vector-icons/FontAwesome"),
    getImage = require("../components/getImage"),
    HTML = require("react-native-htmlview"),
    screen = Dimensions.get('window'),
    ParallaxView = require("react-native-parallax-view");

var api = require("../components/api");

var ShotDetail = require("./ShotDetail");
var ShotCell = require("./ShotCell");
var Loading = require("../components/Loading");

var Player = React.createClass({

  getInitialState: function() {
    return {
      isModalOpen: false,
      isLoading: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      modalUri:"",
    };
  },

  componentWillMount: function() {
  },

  componentDidMount:function(){
    api.getResources(this.props.player.shots_url).then((responseData) => {
      console.log(responseData)
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData),
        isLoading: false
      });
    }).done();
  },
  openModal: function() {
    this.setState({
      isModalOpen: true
    });
  },

  closeModal: function() {
    this.setState({
      isModalOpen: false
    });
  },
  _renderModal(){
    if (this.state.modalUri) {
     var modal= (
    <Modal visible={this.state.isModalOpen} animated={true} >
    <TouchableOpacity onPress={this.closeModal}>
      <View style={styles.playerImageModal}>
      <Image source={{uri:this.state.modalUri}} style={styles.modalImage}
             />
      </View>
      </TouchableOpacity>
    </Modal>
    )}else{
      var modal = null;
     }
    return modal;
  },
  render: function() {
    return (
      <ParallaxView
      windowHeight={260}
      backgroundSource={getImage.authorAvatar(this.props.player)}
      blur={"dark"}
      >
      <View>
        <TouchableOpacity onPress={this.openModal}>
          <View style={styles.headerContent}>
            <View style={styles.innerHeaderContent}>
              <Image source={getImage.authorAvatar(this.props.player)}
              style={styles.playerAvatar} />
              <Text style={styles.playerUsername}>{this.props.player.username}</Text>
              <Text style={styles.playerName}>{this.props.player.name}</Text>
              <View style={styles.playerDetailsRow}>
                <View style={styles.playerCounter}>
                  <Icon name="users" size={18} color="#fff"/>
                  <Text style={styles.playerCounterValue}> {this.props.player.followers_count} </Text>
                </View>
                <View style={styles.playerCounter}>
                  <Icon name="camera-retro" size={18} color="#fff"/>
                  <Text style={styles.playerCounterValue}> {this.props.player.shots_count} </Text>
                </View>
                <View style={styles.playerCounter}>
                  <Icon name="heart-o" size={18} color="#fff"/>
                  <Text style={styles.playerCounterValue}> {this.props.player.likes_count} </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.shotList}>
        {this.state.dataSource.length !== 0 ? this.renderShots() : <Loading />}
      </View>
        {this._renderModal()}
      </ParallaxView>
    );
  },

  renderShots: function() {
    return <ListView
      ref="playerShots"
      contentContainerStyle={styles.list}
      renderRow={this.renderRow}
      dataSource={this.state.dataSource}
      automaticallyAdjustContentInsets={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps={true}
      showsVerticalScrollIndicator={false}
    />;
  },

  renderRow: function(shot: Object)  {
    return <ShotCell
      onSelect={() => this.selectShot(shot)}
      shot={shot}
      columns={4}
    />;
  },

  selectShot: function(shot: Object) {
    this.setState({
      modalUri:shot.images.teaser,
      isModalOpen:true
    })
  },
});

var styles = StyleSheet.create({
  list:{
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  shotList:{
    backgroundColor:"#ea4c89",
  },
  listStyle: {
    flex: 1,
    backgroundColor: "red"
  },
  listView: {
    flex: 1,
    backgroundColor: "coral"
  },
  spinner: {
    width: 50,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  innerHeaderContent: {
    marginTop: 30,
    alignItems: "center"
  },
  playerInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    flexDirection: "row"
  },
  playerUsername: {
    color: "#fff",
    fontWeight: "300"
  },
  playerName: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "900",
    lineHeight: 18
  },
  //Player details list
  playerDetailsRow: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: screen.width / 2,
    marginTop: 20
  },
  playerCounter: {
    flex: 1,
    alignItems: "center"
  },
  playerCounterValue: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
    marginTop: 5,
  },
  playerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 10
  },
  //Modal
  playerImageModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width:screen.width,
    height: screen.height,
  },
  modalImage:{
    width:screen.width * 0.8,
    // resizeMode: "contain",
    height: screen.height / 3,
  },
  //playerContent
  playerContent: {
    padding: 20
  }
});

module.exports = Player;
