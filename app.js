
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , https = require('http')
  , request= require('request')
  , path = require('path')
  , model = require('./model')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , expressSession = require('express-session')
  , nodemailer = require('nodemailer')
  , xoauth2 = require('xoauth2')
  , config = require('./config')
  , schedule = require('node-schedule')
  , moment = require('moment')
  , AWS = require('aws-sdk');
var ejs = require('ejs');
var fs = require('fs');

var userTokens = {};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'dantalayaindia@gmail.com',
            clientId: '301923149956-kl31jahblpp1pu985k0tmacbfosp2o2p.apps.googleusercontent.com',
            clientSecret: 'aaKoyJ7zKlh6q4HzQ1x_3VEa',
            refreshToken: '1/PLlDbp8EG2zVhiw55d9j99UcTJ3R-u_rR3D0o6XWyu0',
            accessToken: 'ya29.GlshBL6du1gvt6A9bOwXK1HXxgp8cosLBgSlhLfJWYDqIGWQIoChmVn92k85i9-6VugBVqnKzX8YItvN6kT4TU1pSLvvfHcfTH_0wwdginPeuNxBVHJvhSYqAeUs'
        })
    }
});


var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressSession({secret: 'mySecretKey',resave: true,
	saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

passport.use( new LocalStrategy(
  function(username, password, done) {
    // check in mongo if a user with username exists or not
	  model.auth.findOne({ 'username' :  username },
      function(err, user) {
		  if (err) {
              return done(err);
          }
          if (!user) {
              return done(null, false, {alert: 'Incorrect username.'});
          }
          if (user.password != password) {
              return done(null, false, {alert: 'Incorrect password.'});
          }
          if (user.activated == false) {
              return done(null, false, {alert: 'Account Not Yet Activated'});
          }
          if ((user.profile==="doctor" || user.profile==="technician" || user.profile==="surgeon") && user.adminactivated == false) {
              return done(null, false, {alert: 'Account Not Yet Activated By Admin'});
          }
          return done(null, user);
      }
    );
}));

passport.serializeUser(function(user, done) {
	  done(null, user._id);
	});

passport.deserializeUser(function(id, done) {
	model.auth.findById(id, function(err, user) {
    done(err, user);
  });
});


// function accessControl(req, res, next) {
//   console.log('hi');
//     if (req.isAuthenticated()) {
//       lo
//         return next();
//     } else {
//         res.redirect('/');
//     }
// }


app.get('/', routes.index);
app.get('/partials/:filename', routes.partials);

AWS.config.region = config.aws.region;
AWS.config.update({
      accessKeyId: config.aws.accessKeyId ,
      secretAccessKey: config.aws.secretAccessKey,
});

var sns = new AWS.SNS();
var ses = new AWS.SES();
sns.setSMSAttributes(
   {
      attributes : {
                      DefaultSMSType : "Transactional"
                }
},
function(error){
              if(error){
                console.log(error);
               }
 });

function sendSms(msg, phn, sub){
	var params = {
		    Message: msg,
		    MessageStructure: 'string',
		    PhoneNumber: phn,
		    Subject: sub
		};

		sns.publish(params, function(err, data) {
		    if (err) {
		    	console.log(err, err.stack);
		    	res.send(err);
		    }// an error occurred
		    else    {
		    	console.log(data);           // successful response
		    }


		});
};
app.post('/sendSms',function(req,res){
	sendSms(req.body.message, req.body.phone, req.body.subject);
	res.send('sms sent successfully');
});

function sendmail(req ,user,  key, email, profile){
	var extra="";
	if(profile !=='patient'){
		extra = 'Once email Verfication is done, await Dantalaya Admin activation to avail all the Sevices. Dantalaya admin activation takes one working day.';
	}
  if(profile == 'doctor'){
    var mailOptions = {
        Source: 'noreply@dantalaya.com', // sender address
        Destination: {ToAddresses :[email]}, // list of receivers
        Message :{
          Subject: {Data: 'Dantalaya Account Activation Link'}, // Subject line
          Body: {
              Html: {
                Data :  "<html>" +
                      "<div> <h2>Dantalaya</h2><p>Click on the Link below to activate your User account</p></div>"+
                      "<a href='http://" +req.get('host') + "/#/activation?user=" + user + "&key="+ key + "'><b>Activate Your Account</b></a>" +
                      "<div><p>"+ extra +"</p></div>"+
                      "<div><p>"+ config.mailText +"</p></div>"+
                      "</html>" // html body
              }
          }
        }
    };
  }else{
    var mailOptions = {
        Source: 'noreply@dantalaya.com', // sender address
        Destination: {ToAddresses :[email]}, // list of receivers
        Message :{
          Subject: {Data: 'Dantalaya Account Activation Link'}, // Subject line
          Body: {
              Html: {
                Data :  "<html>" +
                      "<div> <h2>Dantalaya</h2><p>Click on the Link below to activate your User account</p></div>"+
                      "<a href='http://" +req.get('host') + "/#/activation?user=" + user + "&key="+ key + "'><b>Activate Your Account</b></a>" +
                      "<div><p>"+ extra +"</p></div>"+
                      "<div><p>"+ config.registrationMail +"</p></div>"+
                      "</html>" // html body
              }
          }
        }
    };
  }


	ses.sendEmail(mailOptions, function(err, data){
		if (err) console.log(err, err.stack); // an error occurred
		   else     console.log(data);           // successful response
	});
}
app.post('/auth/login', passport.authenticate('local'),function(req, res){
	var userData = req.user._doc;
	userData.token = Math.random().toString(36).slice(2);
	if (userData.token in userTokens){
		userData.token = Math.random().toString(36).slice(2);
	}
	userTokens[userData.token] = {username: req.user.username, password: req.user.password};
    res.json(userData);
});


app.post('/auth/loginToken',function(req, res){
	if(req.body.token){
		if(userTokens[req.body.token]){
			res.send(userTokens[req.body.token]);
		}
		else{
			res.status(400).send('error');
		}
	}
	else{
		res.status(400).send('error');
	}
});





app.post('/auth/signup',function(req,res){
	req.body.contactInfo.username = req.body.authInfo.username;
	req.body.contactInfo.adminactivated = false;
	req.body.authInfo.activated = false;
	req.body.authInfo.adminactivated = false;
	if(req.body.authInfo.profile == 'patient'){
		req.body.authInfo.adminactivated = true;
		req.body.contactInfo.adminactivated = true;
	}
	req.body.authInfo.email = req.body.contactInfo.email;
	var randomNo = Math.random().toString(36).slice(2);
	req.body.authInfo.key = randomNo;

	var authData = new model.auth(req.body.authInfo);

    var userData =  new model.user({data : req.body.contactInfo});

      model.auth.find({username : req.body.authInfo.username},function(err, list){
    	if(list.length !== 0){
    		res.json({'alert':'userIDError'});
    	}
    	else{
    		authData.save(function(err){
    	        if (err) {
    	            res.json({'alert':'Registration error'});
    	        }else{
    	        	userData.save(function(err){
    	                if (err) {
    	                    res.json({'alert':'Registration error'});
    	                }else{
    	                    res.json({'alert':'Registration success'});
    	                    sendmail(req,req.body.authInfo.username , randomNo , req.body.contactInfo.email , req.body.authInfo.profile);
    	                }
    	            });
    	        }
    	    });
    	}
    });


});

app.post('/payOnlineChargeSheet', function(req, res){
	var headers = { 'X-Api-Key': config.instamojoPrivateKey.apikey, 'X-Auth-Token': config.instamojoPrivateKey.authtoken}
	var payload = {
	  purpose: 'Charge Sheet Bill Payment',
	  amount: req.body.amount,
	  phone: req.body.phone,
	  buyer_name: req.body.buyer_name,
	  redirect_url: "http://" +req.get('host') + "/#/updatePayment",
	  //send_email: true,
	  //send_sms: true,
	  email: req.body.email
   }

	request.post('https://www.instamojo.com/api/1.1/payment-requests/', {form: payload,  headers: headers}, function(error, response, body){
	  if(!error && response.statusCode == 201){
		  res.send({data: body});
	  }
	})

});

app.post('/payOnline', function(req, res){
	model.user.findOne({ "data.username": req.body.doctorusername},function(err, detailss){
			if (err) {
		           res.send(err);
		        }else{
		        	var values = detailss._doc.data;

		        		var payloadAuthRefreshUser = {
							  'grant_type': 'password',
							  'client_id': config.instamojo.clientid,
							  'client_secret': config.instamojo.clientsecret,
						      'username': values.bank.instamojo.username,
						      'password': 'dantalaya1234'
						  };

		        		var paymentRequestData =  req.body.data;
		        		paymentRequestData.redirect_url = "http://" +req.get('host') + "/#/updatePayment";
		        		paymentRequestData.partner_fee_type = "percent";
		        		paymentRequestData.partner_fee = config.partner_fee;


						  request.post('https://api.instamojo.com/oauth2/token/', {form: payloadAuthRefreshUser}, function(error, response, body3){
							  if(!error && response.statusCode !== 400){
								var body3 = JSON.parse(body3);

							    var headersUpdateAccount = {'Authorization' : 'Bearer '+ body3.access_token};

							    request.post('https://api.instamojo.com/v2/payment_requests/', {headers: headersUpdateAccount, form: paymentRequestData}, function(error, response, body4){
									  if(!error && response.statusCode !== 400){
									    res.send({data: body4, username: values.bank.instamojo.username});
									  }
									  else{
										res.status(400).send(body4);
									  }

								  });
							  }
							  else{
								res.status(400).send(body3);
							  }

						  });

		        }

		});
});


app.post('/checkPayment', function(req, res){
	var headers = { 'X-Api-Key': '5513828b2ef00debcaec7c6e6770e11b', 'X-Auth-Token': '3b0c130bc9eb2ff8c5774dffde376e17'}
	request.get('https://www.instamojo.com/api/1.1/payment-requests/'+req.body.id + '/',{headers: headers}, function(error, response, body){
      if(!error && response.statusCode == 200) {
    	  res.send(body);
    	 }
      else{
    	  res.send(body);
      }
	});
});



app.post('/auth/activate',function(req, res){
	var userData = model.auth.findOne({ 'username' :  req.body.user },
		function(err, user) {
			if(!err){
				if(user.key){
				if(user.key == req.body.key){
					user.activated = true;
					model.auth.update({ 'username' :  req.body.user },{ $unset:{ "key": req.body.key }},function(err){
		    	        if (err) {
		    	           res.send('error');
		    	        }else{
		    	        	res.send('success');
		    	        }
		    	    });
					user.save(function (err) {
					    if (err){
					    	res.status(404).send("failure");
					    }
					    res.send("success");
					  });
				}
				}
				else{
					res.status(404).send("Link already activated");
				}
			}
			else{
				res.status(404).send("failure");
			}
	    }
  );
});



app.post('/searchuser',function(req, res){
	var userData = model.user.findOne({ 'data.username' :  req.body.user },
		function(err, user) {
			if(!err){
				res.send(user);
			}
			else{
				res.status(404).send("failure");
			}
	    }
  );
});




app.post('/getuserDetails',function(req, res){
	var userData = model.user.findOne({ 'data.username' :  req.body.user },
		function(err, user) {
			if(!err){
				res.send(user);
			}
			else{
				res.status(404).send("failure");
			}
	    }
  );
});

app.post('/getuserDetailsById',function(req, res){
	var userData = model.user.findOne({ '_id' :  req.body.id },
		function(err, user) {
			if(!err){
				res.send(user);
			}
			else{
				res.status(404).send("failure");
			}
	    }
  );
});









app.post('/admin/activate',function(req, res){
	var userData = model.auth.findOne({ 'username' :  req.body.user },
		function(err, user) {
			if(!err){
					user.adminactivated = true;
					var newText = user.profile == 'doctor' ? config.doctormailText : '';
					user.save(function (err) {
					    if (err){
					    	res.status(404).send("failure");
					    }
					    model.user.findOne({ "data.username": req.body.user},function(err, details){
							if (err) {
						           res.send('error');
						        }else{
						        	var values = details._doc.data;
						        	values['adminactivated'] = true;

						        	model.user.update({ "data.username": req.body.user},{"data" :values },function(err){
						    	        if (err) {
						    	           res.send('error');
						    	        }else{
						    	        	 var mailOptions = {
											    		Source: 'noreply@dantalaya.com', // sender address
											    		Destination: {ToAddresses :[user.email]}, // list of receivers
											    		Message :{
															Subject:{Data: 'Account Activated'}, // Subject line
															Body: {
															    Html: {
															    	Data :  "<html>" +
																    	  	"<div> <h2>Dantalaya</h2></div>"+
																    	  	"<div><p>Your Account has been Activated</p></div><br><br>"+
																      		"<div><p>"+ newText +"</p></div>"+
																      		"<a href='http://" +req.get('host') + "/'><b>Go To Dantalaya</b></a>" +
																      		"</html>" // html body
															    }
															}
											    		}
												};
											    ses.sendEmail(mailOptions, function(err, data){
													if (err) console.log(err, err.stack); // an error occurred
													   else     console.log(data);           // successful response
												});

											    res.send("successfully activated");
						    	        }
						    	    });
						        }

						});




					  });
			}
			else{
				res.status(404).send("failure");
			}
	    }
  );
});

app.post('/admin/reject',function(req, res){
	var userData = model.auth.remove({ 'username' :  req.body.user },
		function(err, user) {
			if(!err){
				model.user.remove({ "data.username": req.body.user},function(err, details){
					if(!err){
						var mailOptions = {
								Source: 'noreply@dantalaya.com', // sender address
								Destination: {ToAddresses :[req.body.email]}, // list of receivers
							    Message :{
									Subject:{Data: 'Account Rejected'}, // Subject line
									Body: {
									    Html: {
									    	Data :  "<html>" +
										    	  	"<div> <h2>Dantalaya</h2></div>"+
										      		"<div><p>Sorry for the inconvenience. Your Account has been Rejected</p></div>"+
										      		"<div><p>For any queries  email info@dantalaya.com</p></div>" +
										      		"</html>" // html body
									    }
									}
					    		}
						};
						ses.sendEmail(mailOptions, function(err, data){
							if (err) console.log(err, err.stack); // an error occurred
							   else     console.log(data);           // successful response
						});
					    res.send("successfully rejected");

					}

				});

			}
			else{
				res.status(404).send("failure");
			}
	    }
  );
});

app.get('/getaccounts',function(req, res){
	var userData = model.auth.find({ 'adminactivated' :  false },{username :1 , profile: 1 , email:1, billnotpaid: 1},
		function(err, user) {
			if(!err){
				res.send(user);
			}
			else{
				res.status(404).send("failure");
			}
	    }
  );
});

app.post('/getAllAccounts',function(req, res){
	model.user.find({ "data.profile" : { $in: req.body.data } } ,function(err, details){
  		 if (err) {
  	           res.send('error');
  	        }else{
  	        	res.send(details);
  	        }

  	});
})

function sendPasswordmail(req, user, pass, email){
	console.log(email);
	var mailOptions = {
			Source: 'noreply@dantalaya.com', // sender address
			Destination: {ToAddresses :[email]}, // list of receivers
		    Message :{
				Subject: {Data: 'Account Password'}, // Subject line
				Body: {
				    Html: {
				    	Data :  "<html>" +
					    	  	"<div> <h2>Dantalaya</h2>" +
					    	  	"<p>Below Are The Respective Username And Password For Your Account</p>" +
					    	  	"<p>Username : <b>"+ user +"</b></p>" +
					    	  	"<p>Password : <b>"+ pass +"</b></p>" +
					    	  	"</div>"+
					      		"<a href='http://" +req.get('host') + "/'><b>Go to Dantalaya Website</b></a>" +
					      		"</html>" // html body
				    }
				}
			}
	};

	ses.sendEmail(mailOptions, function(err, data){
		if (err) console.log(err, err.stack); // an error occurred
		   else     console.log(data);           // successful response
	});
}



function sendappointmentmail( title, name ,starttime, endtime, email,text,from){
var time = starttime.toString();
console.log(email);
if(from == 'Doctor'){
  var mailOptions = {
      Source: 'noreply@dantalaya.com', // sender address
      Destination: {ToAddresses :[email]}, // list of receivers
        Message :{
        Subject: {Data: 'Appointment Mail'}, // Subject line
        Body: {
            Html: {
              Data :  "<html>" +
                    "<div> <h2>Dantalaya</h2>" +
                    "<p>" +text+ "</p>" +
                    "<p>" + from +" : <b>"+ name +"</b></p>" +
                    "<p>Title : <b>"+ title +"</b></p>" +
                    "<p>Date : <b>"+ starttime.slice(0,11) +"</b></p>" +
                    "<p>Time : <b>"+ time.slice(12) +"</b></p>" +
                    "<p>To view your appointment click  below link  and login to your account: <a href='www.dantalaya.com'>www.dantalaya.com</a></p>"+
                    "</div>"+
                    "</html>" // html body
            }
        }
      }
  };
}
else{
  text = "You have an appointment! Details are mentioned below : ";

  var mailOptions = {
      Source: 'noreply@dantalaya.com', // sender address
      Destination: {ToAddresses :[email]}, // list of receivers
        Message :{
        Subject: {Data: 'Appointment Mail'}, // Subject line
        Body: {
            Html: {
              Data :  "<html>" +
                    "<div> <h2>Dantalaya</h2>" +
                    "<p>" +text+ "</p>" +
                    "<p>" + from +" : <b>"+ name +"</b></p>" +
                    "<p>Title : <b>"+ title +"</b></p>" +
                    "<p>Date : <b>"+ starttime.slice(0,11) +"</b></p>" +
                    "<p>Time : <b>"+ time.slice(12) +"</b></p>" +
                    "<p>To confirm/accept the appointment click  below Link  and login to your account: <a href='www.dantalaya.com'>www.dantalaya.com</a></p>"+
                    "</div>"+
                    "</html>" // html body
            }
        }
      }
  };
}




	ses.sendEmail(mailOptions, function(err, data){
		if (err) console.log(err, err.stack); // an error occurred
		   else     console.log(data);           // successful response
	});
}

app.post('/auth/forgotPassword',function(req, res){
	var userData = model.auth.findOne({ 'username' :  req.body.username },
		function(err, user) {
			if(!err){
				sendPasswordmail(req , user.username , user.password , user.email);
				res.send('success');
			}
			else{
				res.status(404).send("failure");
			}
	    }
  );
});

app.post('/appointmentmail',function(req,res){
	 if(req.body.origin == 'patient'){
		 var text="Thanks for scheduling an appointment.Your appointment details are mentioned below.";
		 var name = req.body.data.patientName;
		 var mail = req.body.data.doctorMail;
		 var from = "Patient";
	 }

	 else{
		 var name = req.body.data.doctorName;
		 var mail = req.body.data.patientMail;
		 var from = "Doctor";
     console.log("Patient Mail: "+mail);
     console.log("DoctorName: "+ name);
		 if(req.body.status == 'accept'){
			 var text = "Thanks for scheduling an appointment.Your appointment has been Confirmed by doctor. Request you to be present 15 minutes before the scheduled appointment time.";
			  }
		 else{
			 var text = "Sorry for the inconvenience.Your appointment has been rejected.Please reschedule it.";
		 }
	 }
	 sendappointmentmail( req.body.data.title , name , moment(req.body.data.start).format('DD-MMM-YYYY hh:mm A'), moment(req.body.data.end).format('DD-MMM-YYYY hh:mm A'), mail,text, from);
		res.send('success');
});



app.post('/searchdetails', function(req, res){

	var type = req.body.userstype;
	var speciality = req.body.speciality;
	var val =  req.body.location;

	if(type !== 'technician' && type !== 'surgeon'){
		model.user.find({$and : [{ $or: [ {"data.cliniccity" : new RegExp(val, 'i') } , {"data.clinicaddress" : new RegExp(val, 'i') },{"data.clinicstate" : new RegExp(val, 'i') },{"data.clinicpin" : new RegExp(val, 'i') } , {"data.specialization" : speciality} ] },{ "data.profile": "doctor" },{ "data.adminactivated": true }]},
		  function(err, details) {
		           res.send(details);
		 }).catch(function (err) {
			 res.send(err);
		 });
	}
	else{
		model.user.find({$and : [{ $or: [ {"data.city" : new RegExp(val, 'i') } , {"data.address" : new RegExp(val, 'i') },{"data.state" : new RegExp(val, 'i') },{"data.pin" : new RegExp(val, 'i') } ] },{ "data.profile": type },{ "data.adminactivated": true }]},
		  function(err, details) {
		           res.send(details);
		 }).catch(function (err) {
			 res.send(err);
		 });
	}

});

app.post('/searchpatientdetails', function(req, res){
	var email = req.body.email;

	var phone = parseInt(req.body.phone);
	model.user.find({$and : [{$or: [ { "data.email" : email }, { "data.mobile" : phone }]},{ "data.profile": 'patient' }]},

	function(err, user) {

		if(user.length !== 0){
        res.send(user);
		}
		else{
			 res.json({'alert':"Account doesn't exists"});
		 }
	});
});

app.post('/getAllDetailsFromEmail', function(req, res){
	model.user.find({ "data.email" : req.body.email},
	function(err, user) {
		if(user.length !== 0){
			res.send(user);
		}
		else{
			 res.status(400).send(err);
		 }
	});
});

 app.get('/auth/logout', function(req, res){
     console.log('logout');
    req.logout();
    res.send('sucess');
 });
app.get('/privacy', function (req, res) {
	var filePath = "/pdf/privacypolicy.pdf";

	fs.readFile(__dirname + filePath , function (err,data){
		res.contentType("application/pdf");
		res.send(data);
	});
});
app.get('/t&c', function (req, res) {
	var filePath = "/pdf/tc.pdf";

	fs.readFile(__dirname + filePath , function (err,data){
		res.contentType("application/pdf");
		res.send(data);
	});
});

app.get('/notice', function (req, res) {
	var filePath = "/pdf/Notice.pdf";

	fs.readFile(__dirname + filePath , function (err,data){
		res.contentType("application/pdf");
		res.send(data);
	});
});



 app.post('/getprofile', function(req, res){
	 console.log(req.body.userid);
	 model.user.findOne({'data.username': req.body.userid},
	 	      function(err, user) {
	                    res.send(user);
	 	      }
	    );
 });

 app.post('/profilesave', function(req, res){
	 console.log(req.body.userid);
	 model.user.findOne({'data.username': req.body.userid},
	 	      function(err, user) {
		 			user.data = req.body.data;

		 			user.save(function(err, thor) {
		 				  if (err) return console.error(err);
		 				  res.send('success');
		 				});
	 	      }
	    );
 });

 app.post('/updateBankDetails', function(req, res){

	// var headers = { 'X-Api-Key': config.instamojo.clientid, 'X-Auth-Token': config.instamojo.authtoken}
	 	var bankdata = req.body.bankdata;

	 	if(req.body.userdata.bank){
		    var payloadAuthRefreshUser = {
		    		  'grant_type': 'password',
					  'client_id': config.instamojo.clientid,
					  'client_secret': config.instamojo.clientsecret,
				      'username':req.body.userdata.bank.instamojo.username,
				      'password': 'dantalaya1234'
				  };

				  request.post('https://api.instamojo.com/oauth2/token/', {form: payloadAuthRefreshUser}, function(error, response, body3){
					  if(!error && response.statusCode !== 400){
						var body3 = JSON.parse(body3);
					    var payloadUpdateAccount = {
				    		 'account_holder_name': bankdata.accholdername,
				    	      'account_number': bankdata.bankaccno,
				    	      'ifsc_code': bankdata.ifsccode
						  };

					    var headersUpdateAccount = {'Authorization' : 'Bearer '+ body3.access_token};

					    request.put('https://api.instamojo.com/v2/users/'+ bankdata.instamojo.id +'/inrbankaccount/', {headers: headersUpdateAccount, form: payloadUpdateAccount}, function(error, response, body4){
							  if(!error && response.statusCode !== 400){

								  model.user.findOne({ "data.username": req.body.userid},function(err, detailss){
				    	     			if (err) {
				    	     		           res.send(err);
				    	     		        }else{
				    	     		        	var values = detailss._doc.data;
				    	     		        	values.bank = bankdata;
				    	     		        	model.user.update({ "data.username": req.body.userid},{"data" :values },function(err){
				    	     		    	        if (err) {
				    	     		    	           res.send('error');
				    	     		    	        }else{
				    	     		    	        	res.send('success');
				    	     		    	        }
				    	     		    	    });
				    	     		        }

				    	     		});

							  }
							  else{
								res.status(400).send(body4);
							  }

						  });
					  }
					  else{
						res.status(400).send(body3);
					  }

				  });
	 	}
	 	else{
			var payload = {
				 'grant_type': 'client_credentials',
			     'client_id': config.instamojo.clientid,
			     'client_secret': config.instamojo.clientsecret
			  };

			var payloadCreateUser = {
				 'email': req.body.userdata.email,
			     'password': 'dantalaya1234',
			     'phone': req.body.userdata.mobile,
			     'referrer': 'Dantalayaindia',
			  };


			request.post('https://api.instamojo.com/oauth2/token/', {form: payload}, function(error, response, body){
			  if(!error && response.statusCode !== 400){
				var body = JSON.parse(body);
			    var access_token = body.access_token;
			    var headersCreateUser = { 'Authorization' : 'Bearer '+ access_token};

			    request.post('https://api.instamojo.com/v2/users/', {headers: headersCreateUser ,form: payloadCreateUser}, function(error, response, body1){
			    	if(!error && response.statusCode !== 400){
					  var body1 = JSON.parse(body1);
					  var payloadAuthUser = {
						  'grant_type': 'password',
						  'client_id': config.instamojo.clientid,
						  'client_secret': config.instamojo.clientsecret,
					      'username': body1.username,
					      'password': 'dantalaya1234',
					  };
					  bankdata.instamojo = {};
					  bankdata.instamojo.username = body1.username;
					  bankdata.instamojo.id = body1.id;

					  request.post('https://api.instamojo.com/oauth2/token/', {form: payloadAuthUser}, function(error, response, body2){
						  if(!error && response.statusCode !== 400){
							var body2 = JSON.parse(body2);
						    bankdata.instamojo.access_token = body2.access_token;
						    bankdata.instamojo.refresh_token = body2.refresh_token;

						    var payloadUpdateAccount = {
					    		 'account_holder_name': bankdata.accholdername,
					    	      'account_number': bankdata.bankaccno,
					    	      'ifsc_code': bankdata.ifsccode
							  };

						    var headersUpdateAccount = {'Authorization': 'Bearer '+ body2.access_token};

						    request.put('https://api.instamojo.com/v2/users/'+ bankdata.instamojo.id +'/inrbankaccount/', {headers: headersUpdateAccount, form: payloadUpdateAccount}, function(error, response, body5){
								  if(!error && response.statusCode !== 400){

									  model.user.findOne({ "data.username": req.body.userid},function(err, detailss){
					    	     			if (err) {
					    	     		           res.send(err);
					    	     		        }else{
					    	     		        	var values = detailss._doc.data;
					    	     		        	values.bank = bankdata;
					    	     		        	model.user.update({ "data.username": req.body.userid},{"data" :values },function(err){
					    	     		    	        if (err) {
					    	     		    	           res.send('error');
					    	     		    	        }else{
					    	     		    	        	res.send('success');
					    	     		    	        }
					    	     		    	    });
					    	     		        }

					    	     		});

								  }
								  else{
									res.status(400).send(body5);
								  }

							  });
						  }
						  else{
							res.status(400).send(body2);
						  }

					  });
				  }
				  else{
					  res.status(400).send(body1);
				  }
				});

			  }
			  else{
				  res.status(400).send(body);
			  }
			});

	 	}
 });


 app.post('/changepassword', function(req, res){
	 console.log(req.body.userid);
	 model.auth.findOne({'username': req.body.userid},
	 	      function(err, user) {
		 			if(req.body.data.oldpass !== user.password ){
		 				res.send('failure');
		 			}
		 			user.password = req.body.data.newpass;

		 			user.save(function(err, thor) {
		 				  if (err) return console.error(err);
		 				  res.send('success');
		 				});
	 	      }
	    );
 });

 app.post('/addpatients', function(req, res){
	 var patientdata = new model.user({data: req.body});
	 var email = req.body.email;
	 model.user.find({ "data.email" : email },
				function(err, user) {
					if(user.length !== 0){
			        res.send("Account already exists");
					}
					else{
	                 patientdata.save(function(err){
				        if (err) {
				           res.send('error');
				        }else{
				        	res.send('success');
				        }
				    });
					}
	 });

	 });



 app.post('/addPatientToDoctor', function(req, res){
	 model.user.findOne({ "data.username": req.body.doctorId},function(err, details){
			if (err) {
		           res.send('error');
		        }else{
		        	var values = details._doc.data;

		        	if(typeof values['patients'] == 'object' ){

		        		if(values.patients.includes(req.body.patientId)){
			        		res.send('Patient is Already Added');
			        		return;
			        	}

		        		values['patients'].push( req.body.patientId);
		        	}
		        	else{
		        		values['patients']= [];
		        		values['patients'].push( req.body.patientId);
		        	}

		        	model.user.update({ "data.username": req.body.doctorId},{"data" :values },function(err){
		    	        if (err) {
		    	           res.send('error');
		    	        }else{
		    	        	res.send('success');
		    	        }
		    	    });
		        }

		});
 });


 function sendAWSmail(email, subject , data){
		var mailOptions = {
				Source: 'noreply@dantalaya.com', // sender address
				Destination: {ToAddresses :[email]}, // list of receivers
				Message :{
					Subject: {Data: subject}, // Subject line
					Body: {
					    Html: {
					    	Data :  data
					    }
					}
				}
		};
	ses.sendEmail(mailOptions, function(err, data){
		if (err) console.log(err, err.stack); // an error occurred
		   else     console.log(data);           // successful response
	});
}



 app.post('/addNewPatient', function(req, res){
	  var userData =  new model.user({data : req.body.data});

	  if(!req.body.data.email){
		  userData.save(function(err, doc){
				var newId = (doc._id).toString();
				console.log(newId);
		        if (err) {
		            res.json({'alert':'Registration error'});
		        }else{

		        	model.user.findOne({ "data.username": req.body.doctorId},function(err, details){
		    			if (err) {
		    		           res.send('error');
		    		        }else{
		    		        	var values = details._doc.data;

		    		        	if(typeof values['patients'] == 'object' ){

		    		        		if(values.patients.includes(req.body.patientId)){
		    			        		res.send('Patient is Already Added');
		    			        		return;
		    			        	}

		    		        		values['patients'].push(newId);
		    		        	}
		    		        	else{
		    		        		values['patients']= [];
		    		        		values['patients'].push(newId);
		    		        	}

		    		        	model.user.update({ "data.username": req.body.doctorId},{"data" :values },function(err){
		    		    	        if (err) {
		    		    	           res.send('error');
		    		    	        }else{
		    		    	        	res.send({success: true,data: doc});
		    		    	        }

		    		    	        var mailData = "<html>" +
						    	  	"<div> <h2>Welcome to Dantalaya</h2></div>"+
						      		"<div><p>"+ config.doctorAddPatient +"</p></div>"+
						      		"<a href='http://" +req.get('host') + "/'><b>Go To Dantalaya</b></a>" +
						      		"</html>" ;
		    		    	        sendAWSmail(req.body.data.email,'Welcome to Dantalaya', mailData);
		    		    	    });
		    		        }

		    		});


		        }
		    });
	  }
	  else{
			  model.user.find({ "data.email": req.body.data.email},function(err, acc){
				  if(acc.length != 0){
					  res.send({emailAlreadyPresent : true});
					  return;
				  }
				  else{
					  userData.save(function(err, doc){
							var newId = (doc._id).toString();
							console.log(newId);
					        if (err) {
					            res.json({'alert':'Registration error'});
					        }else{

					        	model.user.findOne({ "data.username": req.body.doctorId},function(err, details){
					    			if (err) {
					    		           res.send('error');
					    		        }else{
					    		        	var values = details._doc.data;

					    		        	if(typeof values['patients'] == 'object' ){

					    		        		if(values.patients.includes(req.body.patientId)){
					    			        		res.send('Patient is Already Added');
					    			        		return;
					    			        	}

					    		        		values['patients'].push(newId);
					    		        	}
					    		        	else{
					    		        		values['patients']= [];
					    		        		values['patients'].push(newId);
					    		        	}

					    		        	model.user.update({ "data.username": req.body.doctorId},{"data" :values },function(err){
					    		    	        if (err) {
					    		    	           res.send('error');
					    		    	        }else{
					    		    	        	res.send({success: true,data: doc});
					    		    	        }

					    		    	        var mailData = "<html>" +
									    	  	"<div> <h2>Welcome to Dantalaya</h2></div>"+
									      		"<div><p>"+ config.doctorAddPatient +"</p></div>"+
									      		"<a href='http://" +req.get('host') + "/'><b>Go To Dantalaya</b></a>" +
									      		"</html>" ;
					    		    	        sendAWSmail(req.body.data.email,'Welcome to Dantalaya', mailData);
					    		    	    });
					    		        }

					    		});


					        }
					    });
				  }

			  });
		 	}


 });

 app.post('/addNewPatientasDependant', function(req, res){
	  var userData =  new model.user({data : req.body.data});
	          req.body.data.dependant = true;
			  userData.save(function(err, doc){
					var newId = (doc._id).toString();
					console.log(newId);
			        if (err) {
			            res.json({'alert':'Registration error'});
			        }else{
			        	model.user.findOne({ "data.username": req.body.doctorId},function(err, details){
			    			if (err) {
			    		           res.send('error');
			    		        }else{
			    		        	var values = details._doc.data;

			    		        	if(typeof values['patients'] == 'object' ){

			    		        		if(values.patients.includes(req.body.patientId)){
			    			        		res.send('Patient is Already Added');
			    			        		return;
			    			        	}

			    		        		values['patients'].push(newId);
			    		        	}
			    		        	else{
			    		        		values['patients']= [];
			    		        		values['patients'].push(newId);
			    		        	}

			    		        	model.user.update({ "data.username": req.body.doctorId},{"data" :values },function(err){
			    		    	        if (err) {
			    		    	           res.send('error');
			    		    	        }else{
			    		    	        	res.send({success: true,data: doc});
			    		    	        }
			    		    	    });
			    		        }

			    		});

			        }
			    });
});


 app.post('/viewAllPatients', function(req, res){
	 model.user.findOne({ "data.username": req.body.doctorId},function(err, details){
		 if (err) {
	           res.send('error');
	        }else{
	        	var patientIds = details._doc.data.patients;
	        	model.user.find({ _id : { $in: patientIds } } ,function(err, details){
		       		 if (err) {
		       	           res.send('error');
		       	        }else{
		       	        	res.send(details);
		       	        }

		       	 });

	        }

	 });

 });


 app.post('/viewTreatment', function(req, res){
	 if(req.body.doctorusername){
		 model.user.find({ _id : { $in: req.body.data }, 'data.doctorusername' : req.body.doctorusername } ,function(err, details){
	   		 if (err) {
	   	           res.send('error');
	   	        }else{
	   	        	res.send(details);
	   	        }

	   	 });
	 }
	 else{
		 model.user.find({ _id : { $in: req.body.data } } ,function(err, details){
	   		 if (err) {
	   	           res.send('error');
	   	        }else{
	   	        	res.send(details);
	   	        }

	   	 });
	 }

 });


app.post('/userviewtreatment', function(req, res){
	if(req.body.doctorusername){
		model.user.find({ _id : { $in: req.body.data }, 'data.doctorusername' : req.body.doctorusername } ,function(err, details){
			if (err) {
				res.send('error');
			}else{
				res.send(details);
			}

		});
	}
	else{
		model.user.find({ _id : { $in: req.body.treatment } } ,function(err, details){
			if (err) {
				res.send('error');
			}else{
				console.log(details)
				res.send(details);
			}

		});
	}

});
 app.post('/viewPayments', function(req, res){
		model.user.find({ _id : { $in: req.body.data } } ,function(err, details){
	   		 if (err) {
	   	           res.send('error');
	   	        }else{
	   	        	res.send(details);
	   	        }

	   	 });
});



 app.post('/updateEvents', function(req, res){
	 model.user.findOne({ "data.username": req.body.doctorId},function(err, details){
			if (err) {
		           res.send('error');
		        }else{
		        	var values = details._doc.data;
		        	values['events'] = req.body.data;

		        	model.user.update({ "data.username": req.body.doctorId},{"data" :values },function(err){
		    	        if (err) {
		    	           res.send('error');
		    	        }else{
		    	        	res.send('success');
		    	        	 model.user.findOne({ _id : req.body.patientId},function(err, detailss){
		    	     			if (err) {
		    	     		           res.send('error');
		    	     		        }else{
		    	     		        	var values = detailss._doc.data;
		    	     		        	var index;
		    	     		        	values['events'].forEach(function(obj,idx){
			    	     		        		if(obj.id == req.body.eventId){
			    	     		        			index = idx;
			    	     		        		}
			    	     		       	});
		    	     		        	if(req.body.status == "accept"){
		    	     		        		values['events'][index].className = 'confirmAppointment';
		    	     		        	}
		    	     		        	else{
		    	     		        		values['events'][index].className = 'rejectAppointment';
		    	     		        	}

		    	     		        	model.user.update({ _id : req.body.patientId},{"data" :values },function(err){
		    	     		    	        if (err) {
		    	     		    	           res.send('error');
		    	     		    	        }else{
		    	     		    	        	res.send('success');
		    	     		    	        }
		    	     		    	    });
		    	     		        }

		    	     		});
		    	        }
		    	    });
		        }

		});
 });


 app.post('/addEvent', function(req, res){
	 model.user.findOne({ "data.username": req.body.doctorId},function(err, details){
			if (err) {
		           res.send('error');
		        }else{
		        	var values = details._doc.data;

		        	if(typeof values['events'] == 'object' ){

		        		values['events'].push( req.body.data);
		        	}
		        	else{
		        		values['events']= [];
		        		values['events'].push( req.body.data);
		        	}

		        	model.user.update({ "data.username": req.body.doctorId},{"data" :values },function(err){
		    	        if (err) {
		    	           res.send('error');
		    	        }else{
		    	        	 model.user.findOne({ "data.username": req.body.patientId},function(err, detailss){
		    	     			if (err) {
		    	     		           res.send('error');
		    	     		        }else{
		    	     		        	var values = detailss._doc.data;

		    	     		        	if(typeof values['events'] == 'object' ){

		    	     		        		values['events'].push( req.body.data);
		    	     		        	}
		    	     		        	else{
		    	     		        		values['events']= [];
		    	     		        		values['events'].push( req.body.data);
		    	     		        	}

		    	     		        	model.user.update({ "data.username": req.body.patientId},{"data" :values },function(err){
		    	     		    	        if (err) {
		    	     		    	           res.send('error');
		    	     		    	        }else{
		    	     		    	        	res.send('success');
		    	     		    	        }
		    	     		    	    });
		    	     		        }

		    	     		});

		    	        }
		    	    });
		        }

		});
 });


 app.post('/viewEvents', function(req, res){
	 model.user.findOne({ "data.username": req.body.doctorId }, {'data.events' : 1},function(err, details){
			if (err) {
		           res.send('error');
		        }else{
		        	res.send(details);
		        }

		});
 });





 app.post('/addTreatment', function(req, res){
	  var userData =  new model.user({data : req.body.data});

		userData.save(function(err, doc){
			var newId = (doc._id).toString();
			console.log(newId);
	        if (err) {
	            res.json({'alert':'Registration error'});
	        }else{

	        	model.user.findOne({ "_id": req.body.id},function(err, details){
	    			if (err) {
	    		           res.send(err);
	    		        }else{
	    		        	var values = details._doc.data;

	    		        	if(typeof values['treatments'] == 'object' ){

	    		        		if(values.treatments.includes(req.body.patientId)){
	    			        		res.send('Treatment is Already Added');
	    			        		return;
	    			        	}

	    		        		values['treatments'].push(newId);
	    		        	}
	    		        	else{
	    		        		values['treatments']= [];
	    		        		values['treatments'].push(newId);
	    		        	}
	    		        	if(typeof values['currenttreatment'] == 'object' ){
	    		        		values['currenttreatment'][req.body.data.doctoruserid] = newId
	    		        	}
	    		        	else{
	    		        		values['currenttreatment'] = {};
	    		        		values['currenttreatment'][req.body.data.doctoruserid] = newId;
	    		        	}
	    		        	model.user.update({ "_id": req.body.id},{"data" :values },function(err){
	    		    	        if (err) {
	    		    	           res.send(err);
	    		    	        }else{
	    		    	        	res.send(doc);
	    		    	        }
	    		    	    });
	    		        }
	    		});
	        }
	    });

});

 app.post('/addBill', function(req, res){
	  var userData =  new model.user({data : req.body.data});

		userData.save(function(err, doc){
			var newId = (doc._id).toString();
			console.log(newId);
	        if (err) {
	            res.json({'alert':'Registration error'});
	        }else{
	        	res.send(doc);
	        }
	    });

});



 app.post('/addToPaymentQueue', function(req, res){
	 model.paymentQueue.findOne({},function(err, details){
		var values = details._doc.data;
		if(!values){
			values = {};
		}
		values[req.body.paymentRequestId] = {};
		if(req.body.chargesheet){
			values[req.body.paymentRequestId].userId = req.body.id;
			values[req.body.paymentRequestId].month = req.body.month;
			values[req.body.paymentRequestId].year = req.body.year;
			values[req.body.paymentRequestId].chargesheet = true;
		}
		else{
			values[req.body.paymentRequestId].treatmentId = req.body.id;
			values[req.body.paymentRequestId].instamojoUsername = req.body.username;
		}
		values[req.body.paymentRequestId].date = new Date();
		model.paymentQueue.update({},{"data" :values },function(err){
	        if (err) {
	           res.send(err);
	        }else{
	        	res.send('success');
	        }
	    });
	 });
});


 app.post('/getParticularChargeSheet', function(req, res){
	 model.chargeSheetSchema.findOne({"month": req.body.month, "year": req.body.year },function(err, details){
		res.send(details._doc.data[req.body.id]);
	 });
 });

 app.post('/addToChargeSheet', function(req, res){
	 model.chargeSheetSchema.findOne({"month": req.body.month, "year": req.body.year },function(err, details){
		if(details){
			var values = details._doc.data;
			if(!values){
				values = {};
			}
			if(values[req.body.doctorid]){
				values[req.body.doctorid].push(req.body.data);
			}
			else{
				values[req.body.doctorid] = [];
				values[req.body.doctorid].push(req.body.data);
			}
			model.chargeSheetSchema.update({"month": req.body.month, "year": req.body.year },{"data" :values , "chargeSheetCreated" : false },function(err){
		        if (err) {
		           res.send(err);
		        }else{
		        	res.send('success');
		        }
		    });

		 }
		else{
			var values = {};
			values[req.body.doctorid] = [];
			values[req.body.doctorid].push(req.body.data);
			 var chargeSheetData =  new model.chargeSheetSchema({"month": req.body.month, "year": req.body.year , "chargeSheetCreated" : false, "data" :values  });
			 chargeSheetData.save(function(err, doc){
					var newId = (doc._id).toString();
					console.log(newId);
			        if (err) {
			            res.json({'alert':'Registration error'});
			        }else{
			        	res.send(doc);
			        }
			    });
		}

	 });
});

app.post('/updatePayment', function(req,res){
	var value;
	 model.paymentQueue.findOne({},function(err, details){
	 value = details._doc.data;

		/*
		var payloadAuthRefreshUser = {
	    		  'grant_type': 'password',
				  'client_id': config.instamojo.clientid,
				  'client_secret': config.instamojo.clientsecret,
			      'username':value[req.body.id].username,
			      'password': 'dantalaya1234'
			  };

			  request.post('https://api.instamojo.com/oauth2/token/', {form: payloadAuthRefreshUser}, function(error, response, body3){
				  if(!error && response.statusCode !== 400){
					var body3 = JSON.parse(body3);

				    var headersUpdateAccount = {'Authorization' : 'Bearer '+ body3.access_token};

				    request.get('https://api.instamojo.com/v2/payment_requests/'+ req.body.id , {headers: headersUpdateAccount}, function(error, response, body4){
						  if(!error && response.statusCode !== 400){
							  model.user.findOne({ "data.username": req.body.userid},function(err, detailss){
			    	     			if (err) {
			    	     		           res.send(err);
			    	     		        }else{
			    	     		        	var values = detailss._doc.data;
			    	     		        	values.bank = bankdata;
			    	     		        	model.user.update({ "data.username": req.body.userid},{"data" :values },function(err){
			    	     		    	        if (err) {
			    	     		    	           res.send('error');
			    	     		    	        }else{
			    	     		    	        	res.send('success');
			    	     		    	        }
			    	     		    	    });
			    	     		        }

			    	     		});

						  }
						  else{
							res.status(400).send(body4);
						  }

					  });
				  }
				  else{
					res.status(400).send(body3);
				  }

			  });*/
	 			if(value[req.body.id].chargesheet){
	 				model.user.findOne({ "_id": value[req.body.id].userId},function(err, detailss){
	 					if (err) {
					           res.send('error');
					        }else{
					        	var values = detailss._doc.data;
					        	values['chargesheet'].map(function(obj, index){
					        		if(obj.month == value[req.body.id].month && obj.year ==  value[req.body.id].year){
					        			values['chargesheet'][index].paidServiceAmount = true;
					        			values['chargesheet'][index].instamojorequestId = req.body.id;
					        		}
					        		model.user.update({ "_id": value[req.body.id].userId},{"data" :values },function(err){
						    	        if (err) {
						    	           res.send(err);
						    	        }else{
						    	        	 model.chargeSheetSchema.findOne({"month": value[req.body.id].month  , "year":  value[req.body.id].year},function(err, chargeSheetDetails){
						    	        		if (err) {
								    	           res.send(err);
								    	        }else{
								    	        	var chargeSheetValues = chargeSheetDetails;
								    	        	chargeSheetValues.total[value[req.body.id].userId].paidServiceAmount = true;
								    	        	chargeSheetValues.total[value[req.body.id].userId].instamojorequestId = req.body.id;
								    	        	model.chargeSheetSchema.update({"month": value[req.body.id].month  , "year":  value[req.body.id].year},{"total" :chargeSheetValues.total },function(err){
													    if (err){
													    	res.status(404).send(err);
													    }
													    else{
													    	delete value[req.body.id];
										    	        	model.paymentQueue.update({},{"data" :value },function(err){
									    		    	        if (err) {
									    		    	           res.send(err);
									    		    	        }else{
									    		    	        	res.send('success');
									    		    	        }
									    		    	    });
													    }
													  });
								    	        }
						    	        	 });
						    	        }
					        		});
					        	});

					        }

	 				});
	 			}
	 			else{
					model.user.findOne({ "_id": value[req.body.id].treatmentId},function(err, detailss){
						var billId;
						if (err) {
					           res.send('error');
					        }else{
					        	var values = detailss._doc.data;
					        	values['treatmentanalysislist'].map(function(obj, index){
					        		if(obj.instamojoPaymentRequestId == req.body.id){
					        			values['treatmentanalysislist'][index].status = "Completed";
					        			billId = values['treatmentanalysislist'][index].billid;
					        		}
					        	});
					        	model.user.update({ "_id": value[req.body.id].treatmentId},{"data" :values },function(err){
					    	        if (err) {
					    	           res.send('error');
					    	        }else{
					    	        	model.user.findOne({ "_id": billId},function(err, billDetails){
							    	        if (err) {
							    	           res.send('error');
							    	        }else{
							    	        	var billValues =  billDetails._doc.data;
							    	        	billValues.status = "Completed";
							    	        	model.user.update({ "_id": billId},{"data" :billValues },function(err){
									    	        if (err) {
									    	           res.send('error');
									    	        }else{
									    	        	delete value[req.body.id];

									    	        	model.paymentQueue.update({},{"data" :value },function(err){
								    		    	        if (err) {
								    		    	           res.send('error');
								    		    	        }else{
								    		    	        	res.send('success');
								    		    	        }
								    		    	    });

									    	        }
									    	    });
							    	        }
							    	    });
					    	        }
					    	    });
					        }
					});
			       }


	 });

});

 app.post('/closeTreatment', function(req, res){
	        	model.user.findOne({ "_id": req.body.id},function(err, details){
	    			if (err) {
	    		           res.send('error');
	    		        }else{
	    		        	var values = details._doc.data;
	    		        	values['currenttreatment'] = '';
	    		        	model.user.update({ "_id": req.body.id},{"data" :values },function(err){
	    		    	        if (err) {
	    		    	           res.send('error');
	    		    	        }else{
	    		    	        	res.send('success');
	    		    	        }
	    		    	    });
	    		        }
	    		});
});


 app.post('/editDetails', function(req, res){
	 console.log(req.body.userid);
	 model.user.findOne({'_id': req.body.id},
	 	      function(err, user) {
		 			user.data = req.body.data;
		 			user.save(function(err, thor) {
		 				  if (err) return console.error(err);
		 				  res.send('success');
		 				});
	 	      }
	    );
 });


app.post('/contactmailsend',function(req,res){
  console.log(req.body.contactName);
  ejs.renderFile(__dirname + "/views/mail/admincopy.ejs", {
                                 contactName: req.body.contactName,
                                 contactEmail: req.body.contactEmail,
                                 contactPhone: req.body.contactPhone,
                                 contactMessage: req.body.contactMessage,
                              }, function (err, data) {
                                 if (err) {
                                     console.log(err);
                                 }
                                 else {

                                   let mailOptions = {
                                     from: '"Dantalaya - Smiles for all" <dantalayaindia@gmail.com>', // sender address
                                     to: "dantalayaindia@gmail.com", // list of receivers
                                     subject: 'Contact Request', // Subject line
                                     html: data
                                 };
                                   transporter.sendMail(mailOptions, (error, info) => {
                                     if (error) {
                                         return console.log(error);
                                     }
                                     console.log('Message sent: %s', info.messageId);
                                 });

                                 }

      });





  ejs.renderFile(__dirname + "/views/mail/contactmail.ejs", {
                                 contactName: req.body.contactName,
                                 contactEmail: req.body.contactEmail,
                                 contactPhone: req.body.contactPhone,
                                 contactMessage: req.body.contactMessage,
                              }, function (err, data) {
                                 if (err) {
                                     console.log(err);
                                 }
                                 else {

                                   let mailOptions = {
                                     from: '"Dantalaya - Smiles for all" <dantalayaindia@gmail.com>', // sender address
                                     to: req.body.contactEmail, // list of receivers
                                     subject: 'Thanks for contacting Dantalaya', // Subject line
                                     html: data
                                 };
                                   transporter.sendMail(mailOptions, (error, info) => {
                                     if (error) {
                                         return console.log(error);
                                     }
                                     console.log('Message sent: %s', info.messageId);
                                 });

                                 }

      });



      res.send({status:'success'});



});


 var monthlyScheduler = schedule.scheduleJob('1 0 1 * *', function(){
	  var currenMonth = new Date().getMonth();
	  var neededYear = new Date().getFullYear();

	  if(currenMonth == 0){
		  currenMonth = 12;
		  neededYear = neededYear -1;
	  }
	  var previousMonth = new Date().setMonth(currenMonth-1);

	  model.chargeSheetSchema.findOne({"month": new Date(previousMonth).toLocaleString( "en-us",{ month: "long" }), "year": neededYear.toString() },function(err, details){
			if(details){
				var values = details._doc;

				values.total = {};
				Object.keys(values.data).map(function(obj){
					var total = parseInt(0);
					values.data[obj].map(function(each){
						total = total + parseInt(each.amount);
					});

					var serviceAmount = (total * config.partner_fee)/100 ;
					values.total[obj] = {totalamount : total , paidServiceAmount : false , serviceAmount: serviceAmount};

					model.user.findOne({ "_id": obj},function(err, details){
		    			if (err) {
		    				console.log(err)
		    		        }else{
		    		        	var values = details._doc.data;
		    		        	if(typeof values['chargesheet'] == 'object' ){
    	     		        		values['chargesheet'].push({totalamount : total , paidServiceAmount : false , serviceAmount: serviceAmount, month: new Date(previousMonth).toLocaleString( "en-us",{ month: "long" }),year: neededYear.toString() });
    	     		        	}
    	     		        	else{
    	     		        		values['chargesheet']= [];
    	     		        		values['chargesheet'].push({totalamount : total , paidServiceAmount : false , serviceAmount: serviceAmount, month: new Date(previousMonth).toLocaleString( "en-us",{ month: "long" }),year: neededYear.toString() });
    	     		        	}

		    		        	model.user.update({ "_id": obj},{"data" :values },function(error){
		    		    	        if (error) {
		    		    	           console.log(error)
		    		    	        }


		    		    	        var mailData = "<html>" +
						    	  	"<div> <h2>Dantalaya</h2></div>"+
						      		"<div><p>Your Bill for the month of  "+ new Date(previousMonth).toLocaleString( "en-us",{ month: "long" }) + " , " + neededYear.toString() + " has been generated. Kindly pay them before 16th of this month to continue availing Dantalaya Services</p></div>"+
						      		"<div><p>Amount to be paid : Rs." + serviceAmount + "</p></div>" +
						      		"</html>" ;
		    		    	        sendAWSmail(values.email,"Bill for the month of  "+ new Date(previousMonth).toLocaleString( "en-us",{ month: "long" }) + " , " + neededYear.toString(), mailData);



		    		    	    });
		    		        }
		    		});

				});

				model.chargeSheetSchema.update({"month": new Date(previousMonth).toLocaleString( "en-us",{ month: "long" }), "year": neededYear.toString() },{"total" :values.total , "chargeSheetCreated" : true },function(err){
			        if (err) {
			        }else{
			        	console.log('Charge Sheet Ran for '+ new Date(previousMonth).toLocaleString( "en-us",{ month: "long" }));
			        }

			    });
			}
	  });
});


 var chargeSheetNonPaymentScheduler = schedule.scheduleJob('1 0 16 * *', function(){
	 var currenMonth = new Date().getMonth();
	  var neededYear = new Date().getFullYear();

	  if(currenMonth == 0){
		  currenMonth = 12;
		  neededYear = neededYear -1;
	  }
	  var previousMonth = new Date().setMonth(currenMonth-1);
	  model.chargeSheetSchema.findOne({"month": new Date(previousMonth).toLocaleString( "en-us",{ month: "long" }), "year": neededYear.toString() },function(err, details){
			if(details){
				var values = details._doc;
				Object.keys(values.total).map(function(obj){
					if(!values.total[obj].paidServiceAmount){
						model.user.findOne({ "_id": obj},function(err, details){
							var values = details._doc.data;
							var username = values.username;
			    			if (err) {
			    				console.log(err);
			    		        }else{
			    		        	//values.billnotpaid = true;
			    		        	values.adminactivated = false;
			    		        	model.user.update({ "_id": obj},{"data" : values },function(error){
			    		    	        if (error) {
			    		    	           console.log(error)
			    		    	        }
			    		    	        var mailData = "<html>" +
							    	  	"<div> <h2>Dantalaya</h2></div>"+
							      		"<div>Sorry for the inconvenience. But your Account has been Deactivated for Non-payment of bill. Kindly contact customer support to activate the account</div>"+
							      		"</html>" ;
			    		    	        sendAWSmail(values.email,"Account Deactivated for Non-payment of Bill", mailData);

			    		    	        model.auth.findOne({ "username": username},function(err, user){
			    			    			if (err) {
			    			    				console.log(err);
			    			    			}
			    			    			user.adminactivated = false;
			    			    			user.billnotpaid = true;
			    			    			user.save(function (err) {
			    							    if (err){
			    							    	res.status(404).send("failure");
			    							    }
			    			    			});
			    		    	        });
			    		    	    });
			    		        }
			    		});
					}
				});
			}
	  });

 });


https.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
