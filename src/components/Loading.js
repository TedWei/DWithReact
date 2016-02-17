import React,{
	ActivityIndicatorIOS,
	StyleSheet,
	View,
} from 'react-native'

var Loading= React.createClass({
    getDefaultProps(){
        return {
            color:"gray"
        }
    },
	render(){
		return (
			<View style={[styles.container,styles.centerText]}>
			  <ActivityIndicatorIOS color={this.props.color} animating={this.props.isLoading} style={styles.spinner} />
			</View>
			);
	}
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "column",
        justifyContent: "center",
    },
    centerText: {
        alignItems: "center",
    },
    spinner: {
        width: 50,
    }
})

module.exports = Loading;
