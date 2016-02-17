"use strict";

var React = require("react-native");
var {
  ActivityIndicatorIOS,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
} = React;

var api = require("../components/api");

var ShotCell = require("./ShotCell"),
    ShotDetails = require("./ShotDetail"),
    ShotDetailWithModal = require("./ShotDetailWithModal"),
    ShotFilter = require("./ShotFilter"),
    Player = require("./Player"),
    Loading = require("../components/Loading"),
    RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
  dataForQuery: [],
  nextPageNumberForQuery: [],
  totalForQuery: [],
};

var LOADING = {};

var ShotList = React.createClass({
  getDefaultProps: function() {
    return {
      filter: "default"
    };
  },

  getInitialState: function() {
    return {
      isLoading: false,
      isLoadingTail: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      queryNumber: 0,
      filters:["default","debuts","animated","rebounds","attachments","playoffs","teams"],
      selectedShot:{},
    };
  },

  componentWillMount: function() {
    this.getShots(this.state.filter);

  },
  _scrollToTop:function(){
    this.refs["listview"].scrollTo(0,0,true)
  },
  componentDidMount:function(){
    var _that=this;
    RCTDeviceEventEmitter.addListener('scrollToTop',function(scroll){
      if (scroll){
        _that._scrollToTop();
      }
    })
  },

  getShots: function(query: string) {
    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    if (cachedResultsForQuery) {
      if (!LOADING[query]) {
        this.setState({
          dataSource: this.getDataSource(cachedResultsForQuery),
          isLoading: false
        });
      } else {
        this.setState({isLoading: true});
      }
      return;
    }

    LOADING[query] = true;
    resultsCache.dataForQuery[query] = null;
    this.setState({
      isLoading: true,
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: false,
    });

    api.getShotsByType(query, 1)
      .catch((error) => {
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = undefined;

        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      })
      .then((responseData) => {
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = responseData;
        resultsCache.nextPageNumberForQuery[query] = 2;

        this.setState({
          isLoading: false,
          dataSource: this.getDataSource(responseData),
        });

      })
      .done();
  },

  hasMore: function(): boolean {
    var query = this.state.filter;
    if (!resultsCache.dataForQuery[query]) {
      return true;
    }
    return (
      resultsCache.totalForQuery[query] !==
      resultsCache.dataForQuery[query].length
    );
  },
  selectPlayer: function(player: Object) {
    this.props.navigator.push({
      component: Player,
      passProps: {player:player},
      title: player.name
    });
  },
  onEndReached: function() {
    var query = this.state.filter;
    if (!this.hasMore() || this.state.isLoadingTail) {
      // We"re already fetching or have all the elements so noop
      return;
    }

    if (LOADING[query]) {
      return;
    }

    LOADING[query] = true;
    this.setState({
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: true,
    });

    var page = resultsCache.nextPageNumberForQuery[query];
    api.getShotsByType(query, page)
      .catch((error) => {
        LOADING[query] = false;
        this.setState({
          isLoadingTail: false,
        });
      })
      .then((responseData) => {
        var shotsForQuery = resultsCache.dataForQuery[query].slice();

        LOADING[query] = false;
        // We reached the end of the list before the expected number of results
        if (!responseData) {
          resultsCache.totalForQuery[query] = shotsForQuery.length;
        } else {
          for (var i in responseData) {
            shotsForQuery.push(responseData[i]);
          }
          resultsCache.dataForQuery[query] = shotsForQuery;
          resultsCache.nextPageNumberForQuery[query] += 1;
        }

        this.setState({
          isLoadingTail: false,
          dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
        });
      })
      .done();
  },

  getDataSource: function(shots: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(shots);
  },

  selectShot: function(shot: Object) {
    this.setState({
      selected:true,
      selectedShot:shot,
    })
  },
  renderFooter: function() {
    return <View style={styles.scrollSpinner}>
      <Loading />
    </View>;
  },

  renderRow: function(shot: Object)  {
    return (
      <ShotCell
        onSelect={() => this.selectShot(shot)}
        onSelectPlayer={()=>this.selectPlayer(shot.user)}
        shot={shot}
      />
    );
  },
  _handleFilter(filter){
    this.setState({
      isLoading:true,
    })
    this.getShots(filter)
  },
  _closeShotDetailModal(bool){
    this.setState({
      selected:false,
      selectedShot:{},
    })
  },
  _renderShotDetailModal(){
    return (
      <ShotDetailWithModal closeModal={this._closeShotDetailModal} shot={this.state.selectedShot} />
      )
  },
  render: function() {
    var content = this.state.dataSource.getRowCount() === 0 || this.state.isLoading ?
      <Loading/> :
      <ListView
        ref="listview"
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;
    return (
      <View style={styles.container}>
        <View style={styles.separator} />
        <ShotFilter updateFilter={this._handleFilter} style={styles.filter} filters={this.state.filters}/>
        {content}
        {this.state.selected ? this._renderShotDetailModal() : null}
      </View>
    );
  },
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    top:64,
  },
  separator: {
    height: 1,
    backgroundColor: "#eeeeee",
  },
  scrollSpinner: {
    marginVertical: 20,
  },
});

module.exports = ShotList;