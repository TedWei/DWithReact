'use strict'
import React,{
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	ScrollView,
} from 'react-native'

var ShotFilter = React.createClass({
	getInitialState(){
		return {
			filter:this.props.selected
		}
	},
	componentWillMount(){
	},
	_changeFilter(filter){
		this.setState({
			filter:filter
		})
		this.props.updateFilter(filter);
	},
	render(){
		var filters = this.props.filters.map((filter)=>{
			return (
				 <TouchableHighlight key={filter} style={this.state.filter === filter ? styles.selected:styles.invisibleTouch}
				                     onPress={this._changeFilter.bind(this, filter)}
				                     underlayColor={"#333"}
				                     activeOpacity={0.95}>
				<View style={styles.cell}>
				<Text style={styles.text}>{filter}</Text>
				</View>
				</TouchableHighlight>
				)
		})
		return (
			<View style={styles.container}>
			<ScrollView style={styles.scrollView}
			automaticallyAdjustContentInsets={false} showsHorizontalScrollIndicator={false} horizontal={true}>
			      {filters}
			 </ScrollView>
			 </View>
			)
	}
})

var styles=StyleSheet.create({
	scrollView:{
		flex:1,
		height: 50,
		backgroundColor: '#ea4c89',
	},
	container:{
		flexDirection: "row",
	},
	selected:{
		backgroundColor:"#333",
	},
	cell: {
	           flex: 1,
	           height: 50,
	       },
	text: {
	            fontSize: 20,
	            textAlign: 'center',
	            margin: 10,
	            color:"#fff"
	},
})

module.exports=ShotFilter