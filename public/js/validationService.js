angular.module('dantalayaApp').service('validationService', function() {
	    this.patientValidation = function () {


	     return true;
	 };

	 this.doctorValidation = function () {
		 return true;
	 };

	 this.technicianValidation = function () {
		 var firstname = document.forms["contactForm"]["contactName"];
		    var lastname = document.forms["contactForm"]["lastName"];
		  var labname = document.forms["contactForm"]["labname"];
		  var residential = document.forms["contactForm"]["residential"];
		  var date = document.forms["contactForm"]["date"];
		  var cityname = document.forms["contactForm"]["City"];
		  var pin = document.forms["contactForm"]["pin"];
		  var mobile = document.forms["contactForm"]["mobile"];
		  var email = document.forms["contactForm"]["email"];
		  var col = document.forms["contactForm"]["col"];
		  var hours = document.forms["contactForm"]["hours"];


		    //Getting error display objects
		  var fname_error = document.getElementById("fname_error");
		  var lname_error = document.getElementById("lname_error");
		  var labname_error = document.getElementById("labname_error");
		  var addr_error = document.getElementById("addr_error");
		  var dob_error = document.getElementById("dob_error");
		  var city_error = document.getElementById("city_error");
		  var pin_errorpin_error = document.getElementById("pin_error");
		  var mobileno_error = document.getElementById("mobileno_error");
		  var email_error = document.getElementById("email_error");
		  var col_error = document.getElementById("col_error");
		  var hours_error = document.getElementById("hours_error");


		   // Setting Event Listeners



		    function SurgeonValidation(){
		        var ok = true;
		        var errorArray = [];

		    var fname = firstname.value;
		    var alphaExp = /^([a-z]+[,.]?[ ]?|[a-z]+['-]?)+$/i;
		    if(fname == null || fname == ""){
		      firstname.style.border = "1px solid red";
		      document.getElementById("fname_error").style.color = "red";
		      document.getElementById("fname_error").innerHTML="First Name is required";
		      errorArray.push(firstname);
		      firstname.focus();
		      ok = false;
		    }
		    else{
		      firstname.style.border = "0px solid red";
		      document.getElementById("fname_error").innerHTML="";
		    }
		    var lname = lastname.value;
		    if(!alphaExp.test(lname)){
		      lastname.style.border = "1px solid red";
		      document.getElementById("lname_error").style.color = "red";
		      document.getElementById("lname_error").innerHTML="Only Alphabets,(dot),(comma) are allowed!";
		      errorArray.push(lastname);
		      lastname.focus();
		      ok = false;
		    }

		    else{
		      lastname.style.border = "0px solid red";
		      document.getElementById("lname_error").innerHTML="";
		    }

		    var dob = date.value;
		    if(dob == null || dob == ""){
		      date.style.border = "1px solid red";
		      document.getElementById("dob_error").style.color = "red";
		      document.getElementById("dob_error").innerHTML = "DOB is required";
		      errorArray.push(date);
		      date.focus();
		      ok = false;
		      }
		      else{
		      date.style.border = "0px solid red";
		      document.getElementById("dob_error").innerHTML="";
		    }
		    var labnameValue = labname.value;

		    if(!alphaExp.test(labnameValue)){
		      labname.style.border = "1px solid red";
		      document.getElementById("labname_error").style.color = "red";
		      document.getElementById("labname_error").innerHTML = "enter valid laboratory name";
		      errorArray.push(labname);
		      labname.focus();
		      ok = false;
		    }
		    else{
		      labname.style.border = "0px solid red";
		      document.getElementById("labname_error").innerHTML="";
		    }

		    var residentialAddr = residential.value;
		    if(residentialAddr == ""){
		      residential.style.border = "1px solid red";
		      document.getElementById("addr_error").style.color = "red";
		      document.getElementById("addr_error").innerHTML = "address cannot be empty";
		      errorArray.push(residential);
		      residential.focus();
		      ok = false;

		    }
		    else{
		      residential.style.border = "0px solid red";
		      document.getElementById("addr_error").innerHTML="";
		    }
		    var cityna = cityname.value;
		    if(!alphaExp.test(cityna)){
		      cityname.style.border = "1px solid red";
		      document.getElementById("city_error").style.color = "red";
		      document.getElementById("city_error").innerHTML="Enter a valid city";
		      errorArray.push(cityname);
		      cityname.focus();
		      ok = false;
		    }
		    else{
		      cityname.style.border = "0px solid red";
		      document.getElementById("city_error").innerHTML="";
		    }
		    var zipCodeRegex = /^[1-9][0-9]{5}$/;
		    var zipCode = pin.value;
		    if(!zipCodeRegex.test(zipCode)){
		      pin.style.border = "1px solid red";
		      document.getElementById("pin_error").style.color = "red";
		      document.getElementById("pin_error").innerHTML="Enter valid pincode";
		      errorArray.push(pin);
		      pin.focus();
		      ok = false;
		    }
		    else{
		      pin.style.border = "0px solid red";
		      document.getElementById("pin_error").innerHTML="";
		    }
		    var mobileRegex = /^\d{10}$/;
		    var mobileNO = mobile.value;
		    if (!mobileRegex.test(mobileNO)){
		      mobile.style.border = "1px solid red";
		      document.getElementById("mobileno_error").style.color = "red";
		      document.getElementById("mobileno_error").innerHTML="Enter valid mobile number";
		      errorArray.push(mobile);
		      mobile.focus();
		      ok = false;
		    }
		    else{
		      mobile.style.border = "0px solid red";
		      document.getElementById("mobileno_error").innerHTML="";
		    }
		    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    var emailId = email.value;
		    if(!emailRegex.test(emailId)){
		      email.style.border = "1px solid red";
		      document.getElementById("email_error").style.color = "red";
		      document.getElementById("email_error").innerHTML="Enter valid email Id";
		      errorArray.push(email);
		      email.focus();
		      ok = false;
		    }
		    else{
		      email.style.border = "0px solid red";
		      document.getElementById("email_error").innerHTML="";
		    }

		    if(errorArray.length>0){
		      errorArray[0].focus();
		    }
				if(!contactForm.agree.checked) {

					contactForm.agree.focus();
					ok= false;
				}

				if(!contactForm.certify.checked) {

					contactForm.certify.focus();
					ok = false;
				}
		    return ok;



		    }
		return SurgeonValidation();
	 };

	 this.surgeonValidation = function () {
		 var firstname = document.forms["contactForm"]["contactName"];
		    var lastname = document.forms["contactForm"]["lastName"];
		  var aadhaar = document.forms["contactForm"]["aadhaar"];
		  var residential = document.forms["contactForm"]["residential"];
		  var date = document.forms["contactForm"]["date"];
		  var cityname = document.forms["contactForm"]["City"];
		  var pin = document.forms["contactForm"]["pin"];
		  var mobile = document.forms["contactForm"]["mobile"];
		  var email = document.forms["contactForm"]["email"];
		  var si = document.forms["contactForm"]["si"];
		  var ci = document.forms["contactForm"]["ci"];


		    //Getting error display objects
		  var fname_error = document.getElementById("fname_error");
		  var lname_error = document.getElementById("lname_error");
		  var aadhaar_error = document.getElementById("aadhaar_error");
		  var addr_error = document.getElementById("addr_error");
		  var dob_error = document.getElementById("dob_error");
		  var city_error = document.getElementById("city_error");
		  var pin_errorpin_error = document.getElementById("pin_error");
		  var mobileno_error = document.getElementById("mobileno_error");
		  var email_error = document.getElementById("email_error");
		  var si_error = document.getElementById("si_error");
		  var city_error = document.getElementById("ci_error");

		   // Setting Event Listeners

		    function SurgeonValidation(){
		        var ok = true;
		        var errorArray = [];

		    var fname = firstname.value;
		    var alphaExp = /^([a-z]+[,.]?[ ]?|[a-z]+['-]?)+$/i;
		    if(fname == null || fname == ""){
		      firstname.style.border = "1px solid red";
		      document.getElementById("fname_error").style.color = "red";
		      document.getElementById("fname_error").innerHTML="First Name is required";
		      errorArray.push(firstname);
		      firstname.focus();
		      ok = false;
		    }
		    else{
		      firstname.style.border = "0px solid red";
		      document.getElementById("fname_error").innerHTML="";
		    }
		    var lname = lastname.value;
		    if(!alphaExp.test(lname)){
		      lastname.style.border = "1px solid red";
		      document.getElementById("lname_error").style.color = "red";
		      document.getElementById("lname_error").innerHTML="Only Alphabets,(dot),(comma) are allowed!";
		      errorArray.push(lastname);
		      lastname.focus();
		      ok = false;
		    }

		    else{
		      lastname.style.border = "0px solid red";
		      document.getElementById("lname_error").innerHTML="";
		    }

		    var dob = date.value;
		    if(dob == null || dob == ""){
		      date.style.border = "1px solid red";
		      document.getElementById("dob_error").style.color = "red";
		      document.getElementById("dob_error").innerHTML = "DOB is required";
		      errorArray.push(date);
		      date.focus();
		      ok = false;
		      }
		      else{
		      date.style.border = "0px solid red";
		      document.getElementById("dob_error").innerHTML="";
		    }
		    var aadhaarno = aadhaar.value;
		    var aadhaarRegex = /^\d{4}\d{4}\d{4}$/;
		    if(!aadhaarRegex.test(aadhaarno) && aadhaarno!=""){
		      aadhaar.style.border = "1px solid red";
		      document.getElementById("aadhaar_error").style.color = "red";
		      document.getElementById("aadhaar_error").innerHTML = "enter valid aadhaar number";
		      errorArray.push(aadhaar);
		      aadhaar.focus();
		      ok = false;
		    }
		    else{
		      aadhaar.style.border = "0px solid red";
		      document.getElementById("aadhaar_error").innerHTML="";
		    }

		    var residentialAddr = residential.value;
		    if(residentialAddr == ""){
		      residential.style.border = "1px solid red";
		      document.getElementById("addr_error").style.color = "red";
		      document.getElementById("addr_error").innerHTML = "address cannot be empty";
		      errorArray.push(residential);
		      residential.focus();
		      ok = false;

		    }
		    else{
		      residential.style.border = "0px solid red";
		      document.getElementById("addr_error").innerHTML="";
		    }
		    var cityna = cityname.value;
		    if(!alphaExp.test(cityna)){
		      cityname.style.border = "1px solid red";
		      document.getElementById("city_error").style.color = "red";
		      document.getElementById("city_error").innerHTML="Enter a valid city";
		      errorArray.push(cityname);
		      cityname.focus();
		      ok = false;
		    }
		    else{
		      cityname.style.border = "0px solid red";
		      document.getElementById("city_error").innerHTML="";
		    }
		    var zipCodeRegex = /^[1-9][0-9]{5}$/;
		    var zipCode = pin.value;
		    if(!zipCodeRegex.test(zipCode)){
		      pin.style.border = "1px solid red";
		      document.getElementById("pin_error").style.color = "red";
		      document.getElementById("pin_error").innerHTML="Enter valid pincode";
		      errorArray.push(pin);
		      pin.focus();
		      ok = false;
		    }
		    else{
		      pin.style.border = "0px solid red";
		      document.getElementById("pin_error").innerHTML="";
		    }
		    var mobileRegex = /^\d{10}$/;
		    var mobileNO = mobile.value;
		    if (!mobileRegex.test(mobileNO)){
		      mobile.style.border = "1px solid red";
		      document.getElementById("mobileno_error").style.color = "red";
		      document.getElementById("mobileno_error").innerHTML="Enter valid mobile number";
		      errorArray.push(mobile);
		      mobile.focus();
		      ok = false;
		    }
		    else{
		      mobile.style.border = "0px solid red";
		      document.getElementById("mobileno_error").innerHTML="";
		    }
		    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		    var emailId = email.value;
		    if(!emailRegex.test(emailId)){
		      email.style.border = "1px solid red";
		      document.getElementById("email_error").style.color = "red";
		      document.getElementById("email_error").innerHTML="Enter valid email Id";
		      errorArray.push(email);
		      email.focus();
		      ok = false;
		    }
		    else{
		      email.style.border = "0px solid red";
		      document.getElementById("email_error").innerHTML="";
		    }
		    var startDateValue = si.value;
		    if(startDateValue == null || startDateValue == ""){
		      si.style.border = "1px solid red";
		      document.getElementById("si_error").style.color = "red";
		      document.getElementById("si_error").innerHTML = "start date is required";
		      errorArray.push(si);
		      si.focus();
		      ok = false;
		      }
		      else{
		      si.style.border = "0px solid red";
		      document.getElementById("si_error").innerHTML="";
		    }


				if(!contactForm.agree.checked) {

					contactForm.agree.focus();
					ok= false;
				}

				if(!contactForm.certify.checked) {

					contactForm.certify.focus();
					ok = false;
				}



		    return ok;


		    }

		return SurgeonValidation();
	 };

});
