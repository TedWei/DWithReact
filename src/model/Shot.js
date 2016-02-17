var api = require("../components/api");
var utils = require("../components/utils");

class Shot {
	constructor(obj){
		this.id = obj.id;
	}
	create(obj){
		return api.request("shots",{
			method:"post",
			body:api.parseToQuery(obj)
		}).then((responseData)=>{
			if (responseData.status === 202){
				return true;
			}
			return false;
		})
	}
	update(shot){
		temp=utils.extend({},shot);
		return api.request("shots/"+this.id,{
			method:"put",
			body:api.parseToQuery(temp)
		}).then((responseData)=>{

		})
	}
	delete(){
		return api.request("shots/"+this.id,{
			method:"delete"
		}).then((responseData)=>{
			console.log(responseData);
		})
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
	getComment(){
		return api.request("shots/"+this.id+"/comments").then((responseData) => responseData)
	}
}

module.exports = Shot;