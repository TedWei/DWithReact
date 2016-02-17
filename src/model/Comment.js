'use strict'
var api = require("../components/api");
var utils = require("../components/utils");
class Comment{
	constructor(shotId : ?Number,comment :?Object){
		this.comment = comment;
		this.id = comment.id;
		this.shotId = shotId;
		this.baseUrl = "shots/"+this.shotId+"/comments";
	}
	create(comment:?String) :?Boolean{
		return api.request(this.baseUrl,{
			method:"post",
			body:comment
		}).then((responseData)=>{
			if (responseData.id){
				return true;
			}
			return false;
		})
	}
	getLikes():?Array{
		return api.request(this.baseUrl+"/"+this.id+"/likes").then((responseData)=>{
			return responseData
		})
	}
	update(comment):?Boolean{
		return api.request(this.baseUrl+"/"+this.comment.id,{
			method:"put",
			body:comment
		}).then((responseData)=>{
			if (responseData.id){
				return true;
			}
			return false;
		})
	}
	delete(){
		return api.request(this.baseUrl+"/"+this.comment.id,{
			method:"delete",
			body:comment
		}).then((responseData)=>{
			if (responseData.status === 204){
				return true;
			}
			return false;
		})
	}
	isLike(){
		return api.request(this.baseUrl+"/"+this.comment.id+"/like",{
			method:"get",
		}).then((responseData)=>{
			if (responseData.id){
				return true;
			}
			return false;
		})
	}
	like(){
		return api.request(this.baseUrl+"/"+this.comment.id+"/like",{
			method:"post",
		}).then((responseData)=>{
			if (responseData.id){
				return true;
			}
			return false;
		})
	}
	unlike(){
		return api.request(this.baseUrl+"/"+this.comment.id+"/like",{
			method:"delete",
		}).then((responseData)=>{
			if (responseData.status === 204){
				return true;
			}
			return false;
		})
	}
}

module.exports=Comment