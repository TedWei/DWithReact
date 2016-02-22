'use strict';

import React,{
    AsyncStorage
} from 'react-native';

var API_URL = "https://api.dribbble.com/v1/",
    ACCESS_TOKEN = "",
    // ACCESS_TOKEN = "4fb0ff870de6bb9a3122ccf9f899e9c6a7a4ca135feda2d53d652e5e6a57da26",
    CLIENT_ID = "02f5319f14a914740fe29fca2ded71e4435e4dc4bff14117aad846ad5b12eeb7",
    CLIENT_SECRET = "a481300ee6005a80cbd39d4cf0722260eb8637cca30024cbf293e983739c318e",
    AUTHORIZE_URL = "https://dribbble.com/oauth/authorize",
    ACCESS_TOKEN_URL="https://dribbble.com/oauth/token",
    STATE = "zhangsan",
    REDIRECT_URI = "http://tedwei.github.io",
    SCOPE = "public+write+comment+upload",
    APP_NAME ="DWithReact",
    ACCESS = {};

var utils = require('./utils');

function fetchData(URL,setting) {
    var defaultSetting = {
        headers: {
            "Authorization": utils.titleCase(ACCESS.token_type)+" " + ACCESS.access_token
        },
    };
    var setting = utils.extend(defaultSetting,setting);
    return fetch(URL,setting).then((responseData) => {
        console.log(responseData)
        if (responseData.status ==200 || responseData.status ==201){
            return responseData.json();
        }else{
            return responseData;
        }
    })
}

function getConfig(){
    return {
        API_URL:API_URL,
        ACCESS_TOKEN:ACCESS_TOKEN,
        REDIRECT_URI:REDIRECT_URI,
        SCOPE:SCOPE,
        ACCESS:ACCESS,
        APP_NAME:APP_NAME,
        STORAGE_PRE:"@"+APP_NAME+":",
    }
}

async function initConfig(){
    ACCESS = JSON.parse((await storage.getItem("ACCESS"))) || {};
    ACCESS_TOKEN = await storage.getItem("ACCESS_TOKEN");
}

var storage ={
    async getItem(name){
        var value = await AsyncStorage.getItem(getConfig().STORAGE_PRE+name);
        return value;
    },
    async setItem(name,value){
        return await AsyncStorage.setItem(getConfig().STORAGE_PRE+name,value);
    }
};

function getAuthorize() {
    return fetch(AUTHORIZE_URL + '?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + '&scope=' + SCOPE + '&state=' + STATE).then((responseData) => {
        if (responseData.status == 200) {
            var code = utils.parseQuery(responseData.url).code;
            if (responseData.url.indexOf(REDIRECT_URI) >-1 && code){
                return getAccessToken(code)
            }else{
                return {
                    isLogining:true,
                    responseData:responseData,
                }
            }
        }
    })
}


async function setConfig(){
    await storage.setItem("ACCESS_TOKEN",ACCESS_TOKEN);
    await storage.setItem("ACCESS",JSON.stringify(ACCESS));
}

function getAccessToken(CODE) {
    return fetch(ACCESS_TOKEN_URL, {
        method: 'post',
        body: 'client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + '&code=' + CODE + '&client_secret=' + CLIENT_SECRET
    }).then((responseData) => {
        if (responseData.status == 200){
            ACCESS = JSON.parse(responseData._bodyText);
            ACCESS_TOKEN = ACCESS.access_token;
            setConfig().done();
            return {
                isLogin:true
            };
        }
    })
}


initConfig();

module.exports = {
    getUser: function(): ? Object {
        return fetchData(API_URL + 'user');
    },

    getAuthorize: getAuthorize,
    getAccessToken:getAccessToken,
    getConfig:getConfig,
    storage:storage,
    getShotsByType: function(type: string, pageNumber: ?number): ?Object {
      var URL = API_URL + "shots/?list=" + type;
      if (pageNumber) {
        URL += "&per_page=10&page=" + pageNumber;
      }

      return fetchData(URL);
    },
    getSingleUser: function(user: ? number): ? Object {
        return fetchData(API_URL + 'users/' + user);
    },
    getResources: function(url: ? string): ? Object {
        return fetchData.apply(this,arguments);
    },
    request: function(url: ? string ,request: ?Object): ? Object {
        return fetchData(API_URL + url,request);
    },
}
