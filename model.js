var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.host,function(){
		console.log('mongodb connected');
});

	var authSchema = new mongoose.Schema({
	    username: String,
	    password: String,
	    profile: String,
	    activated: Boolean,
	    adminactivated : Boolean,
	    key : String,
	    email : String
});

	var userSchema = new mongoose.Schema({
		data: mongoose.Schema.Types.Mixed
	});
	
	var paymentQueueSchema = new mongoose.Schema({
		data: mongoose.Schema.Types.Mixed     
	});
	

	var dbModel = {};
	dbModel.auth = mongoose.model('authSchema',authSchema ,'authSchema');
	dbModel.user = mongoose.model('userSchema',userSchema ,'userSchema');
	dbModel.paymentQueue = mongoose.model('paymentQueueSchema',paymentQueueSchema ,'paymentQueueSchema');


module.exports = dbModel;
