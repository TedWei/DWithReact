"use strict";

var React = require("react-native");
var {
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity,
} = React;

var getImage = require("../components/getImage"),
    screen = Dimensions.get('window');

var ShotCell = React.createClass({
  getDefaultProps(){
    return {
      columns:1
    }
  },
  _renderUser(){
    if (this.props.shot.user){
      return (
        <View style={styles.shotHeader}>
        <TouchableOpacity onPress={this.props.onSelectPlayer}>
          <Image source={getImage.authorAvatar(this.props.shot.user)}
                   style={styles.avatar}/>
        </TouchableOpacity>
          <View style={styles.shotName}>
            <Text style={styles.userName}>
              {this.props.shot.user.name}
            </Text>
            <Text style={styles.shotTitle}>
              {this.props.shot.title}
            </Text>
          </View>
        </View>
        )
    }
    return null;
  },
  _renderImage(){
    return this.props.columns > 1 ? this._imageWithOpacity() : this._ImageWithHighlight();
  },
  _imageWithOpacity(){
    var columnsCellImage = {
      backgroundColor: "transparent",
      resizeMode: "cover",
      width: screen.width / this.props.columns,
      height: 300/ this.props.columns,
      padding:1,
    };
    return ( <TouchableOpacity onPress={this.props.onSelect}>
       <Image
         source={getImage.shotImage(this.props.shot)}
         style={columnsCellImage}
         accessible={true}
       />
       </TouchableOpacity>
       )
  },
  _ImageWithHighlight(){
    return ( <TouchableHighlight onPress={this.props.onSelect}>
       <Image
         source={getImage.shotImage(this.props.shot)}
         style={styles.cellImage}
         accessible={true}
       />
       </TouchableHighlight>
       )
  },
  render: function() {
    return (
      <View>
          <View style={styles.row}>
          {this._renderUser()}
          {this._renderImage()}
          </View>
        <View style={styles.cellBorder} />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  row: {
    backgroundColor: "transparent",
    flexDirection: "column"
  },
  cellImage: {
    height: 300,
    width: screen.width,
    backgroundColor: "transparent",
    resizeMode: "cover"
  },
  cellBorder: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    // Trick to get the thinest line the device can display
    height: 1 / PixelRatio.get(),
    marginLeft: 4,
  },
  shotHeader: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  userName: {
    fontWeight: "400"
  },
  shotName: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  shotTitle: {
    flex: 1,
    flexDirection: "row"
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  }
});

module.exports = ShotCell;
