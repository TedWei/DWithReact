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

var screen = Dimensions.get('window'),
	WEBVIEW_REF ='webview',
	utils = require('../components/utils'),
	api = require('../components/api');
var Login = React.createClass({
	getInitialState(){
		return {
			modalOpen:true,
			isLogining:false,
			isLogin:false,
			url:"",
			loginContent:{},
		}
	},
	_loadInitialState(){
		var _that = this;
		api.getAuthorize().then((responseData)=>{
			if (responseData.isLogining){
			   _that.setState({
			     url:responseData.responseData.url,
			     loginContent:responseData.responseData,
			   })
		   }
		})
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
		this._loadInitialState();
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
	_renderView(){
		return (
			<WebView ref={WEBVIEW_REF} visible={this.state.modalOpen} startInLoadingState={true} automaticallyAdjustContentInsets={true} scalesPageToFit={true} url={this.state.url} onNavigationStateChange={this.onNavigationStateChange} html={this.state.loginContent._bodyText} style={styles.webview} />
			)
	},
	render(){
		return(
		<Modal animated={true} style={styles.modal} >
		<View style={styles.container}>
			{this.state.url ?this._renderView():null}
		</View>
		</Modal>
		)
	}
})

var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';

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
})

module.exports = Login
