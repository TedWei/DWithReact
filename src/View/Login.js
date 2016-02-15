'use strict';

import React,{
    StyleSheet,
    WebView,
    Modal,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native'

var screen = Dimensions.get('window');
var WEBVIEW_REF ='webview';
var utils = require('../components/utils');
var api = require('../components/api');
var Login = React.createClass({
	getInitialState(){
		return {
			modalOpen:true,
			isLogining:false,
			isLogin:false,
		}
	},
	closeModal(){
		var _that= this;
		function setModalClose(){
			_that.setState({
				modalOpen:false,
			})
		}
		Alert.alert('Are you Sure?','Close the login page!',[{text:'Cancel',onPress:()=>console.log('cancel')},{text:'Ok',onPress:()=>setModalClose()}]);
	},
	checkLogin(url){
		if (url.indexOf(api.getConfig().REDIRECT_URI) >-1){
			return true;
		}
		return false;
	},
	getAccessToken(url){
		var _that = this;
		if (this.checkLogin(url)){
			var code = utils.parseQuery(url).code || "";
			if (code && !_that.state.isLogining){
				_that.setState({
					isLogining:true,
				})
				api.getAccessToken(code).then((responseData)=>{
					if (responseData.isLogin){
						_that.setState({
							isLogining:false,
							isLogin:true,
							modalOpen:false,
						})
						_that.props.updateLogin(true);
						// _that.state.
					}
				});
			}
		}
	},
	componentWillMount(){
	},
	goBack() {
	  this.refs[WEBVIEW_REF].goBack();
	},

	goForward() {
	  this.refs[WEBVIEW_REF].goForward();
	},
	onload(){
	},
	onNavigationStateChange(navState){
		if (!this.state.isLogin){
			this.getAccessToken(navState.url)
		}
	},
	reload() {
	  this.refs[WEBVIEW_REF].reload();
	},
	render(){
		return(
		<Modal animated={true} style={styles.modal} visible={this.state.modalOpen}>
		<View style={styles.container}>
			<WebView ref={WEBVIEW_REF} startInLoadingState={true} automaticallyAdjustContentInsets={true} scalesPageToFit={true} url={this.props.url} onNavigationStateChange={this.onNavigationStateChange} onLoad={this.onload} style={styles.webview} />
			<View style={[styles.addressBarRow]}>
		          <TouchableOpacity
		            onPress={this.goBack}
		            style={this.state.backButtonEnabled ? styles.navButton : styles.disabledButton}>
		            <Text>
		               {'<'}
		            </Text>
		          </TouchableOpacity>
		          <TouchableOpacity
		            onPress={this.goForward}
		            style={this.state.forwardButtonEnabled ? styles.navButton : styles.disabledButton}>
		            <Text>
		              {'>'}
		            </Text>
		          </TouchableOpacity>
		          <TouchableOpacity
		            onPress={this.closeModal}
		            style={styles.disabledButton}>
		            <Text>
		              {'x'}
		            </Text>
		          </TouchableOpacity>
		    </View>
		</View>
		</Modal>
		)
	}
})

var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';
var TEXT_INPUT_REF = 'urlInput';

var styles = StyleSheet.create({
    modal: {
        flex: 1,
    },
  	container: {
      flex: 1,
      backgroundColor: HEADER,
    },
    addressBarRow: {
      flexDirection: 'row',
      padding:8,
    },
    webView: {
      backgroundColor: BGWASH,
      height: 350,
    },
    navButton: {
      width: 20,
      padding: 3,
      marginRight: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: BGWASH,
      borderColor: 'transparent',
      borderRadius: 3,
    },
    disabledButton: {
      width: 20,
      padding: 3,
      marginRight: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: DISABLED_WASH,
      borderColor: 'transparent',
      borderRadius: 3,
    },
})

module.exports = Login
