var mongoose = require('mongoose');
var config = require('./config');
var bcrypt   = require('bcrypt-nodejs');

mongoose.connect(config.host,function(){
		console.log('mongodb connected');
});

	var authSchema = new mongoose.Schema({
		    username: String,
			password: String,
			mobile: String,
		    profile: String,
		    activated: Boolean,
		    adminactivated : Boolean,
		    billnotpaid: Boolean,
		    key : String,
			email : String,
			lastlogin : String
	});
	
	// generating a hash
	authSchema.methods.generateHash = function(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	// checking if password is valid
	authSchema.methods.validPassword = function(password) {
	    return bcrypt.compareSync(password, this.local.password);
	};

	var userSchema = new mongoose.Schema({
		data: mongoose.Schema.Types.Mixed
	});
	
	var paymentQueueSchema = new mongoose.Schema({
		data: mongoose.Schema.Types.Mixed     
	});
	
	var chargeSheetSchema = new mongoose.Schema({
		data: mongoose.Schema.Types.Mixed,
		month: String,
		year: String,
		chargeSheetCreated: Boolean,
		total: mongoose.Schema.Types.Mixed
	});
	
	

	var dbModel = {};
	dbModel.auth = mongoose.model('authSchema',authSchema ,'authSchema');
	dbModel.user = mongoose.model('userSchema',userSchema ,'userSchema');
	dbModel.paymentQueue = mongoose.model('paymentQueueSchema',paymentQueueSchema ,'paymentQueueSchema');
	dbModel.chargeSheetSchema = mongoose.model('chargeSheetSchema',chargeSheetSchema ,'chargeSheetSchema');


module.exports = dbModel;
