class User {
	constructor(){
	}
	get current(){
		return this.currentUser;
	}
	set current(user){
		this.currentUser = user;
	}
}

module.exports = User