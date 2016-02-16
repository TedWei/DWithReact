var api = require("../components/api");
var utils = require("../components/utils");

class Shot {
	constructor(obj){
		this.id = obj.id;
	}
	isLike(){
		return api.request("shots/"+this.id+"/like",{
			method:'get',
		}).then((responseData)=>{
			if (responseData.id){
				return true;
			}
			return false;
		})
	}
	like(){
		return api.request("shots/"+this.id+"/like",{
			method:'post',
		}).then((responseData)=>{
			if (responseData.id){
				return true;
			}
			return false;
		})
	}
	unlike(){
		return api.request("shots/"+this.id+"/like",{
			method:'delete',
		}).then((responseData)=>{
			if (responseData.status === 204){
				return true;
			}
			return false;
		})
	}
}

module.exports = Shot;