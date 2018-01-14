angular.module('dantalayaApp').service('validationService', function() {
	    this.patientValidation = function () {
	    	var firstname = document.forms["contactForm"]["contactName"];
	        var lastname = document.forms["contactForm"]["lastName"];
	        var aadhaar = document.forms["contactForm"]["aadhaar"];
	        var residential = document.forms["contactForm"]["residential"];
	        var date = document.forms["contactForm"]["date"];
	        var cityname = document.forms["contactForm"]["City"];
	        var pin = document.forms["contactForm"]["pin"];
	        var mobile = document.forms["contactForm"]["mobile"];
	        var email = document.forms["contactForm"]["email"];
	        var ans1 = document.forms["contactForm"]["answer"];
	        var ans2 = document.forms["contactForm"]["answer2"];
	        var ques1 = document.forms["contactForm"]["sec1"];
	        var ques2 = document.forms["contactForm"]["sec2"];
					var state = document.forms["contactForm"]["state"];





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
	        var ans1_error = document.getElementById("ans1_error");
	        var ans2_error = document.getElementById("ans2_error");
	        var ques1_error = document.getElementById("ques1_error");
	        var ques2_error = document.getElementById("ques2_error");
					var state_error = document.getElementById("state_error");


	        // Validation Function
	        function PatientValidate(){
	          //error array


	         var errorArray = [];
	          var ok = true;

						var stateValue = state.value.trim();
						if(stateValue ==null || stateValue == "" || stateValue =="? string: ?"){
							state.style.border = "1px solid red";
	            document.getElementById("state_error").style.color = "red";
	            document.getElementById("state_error").innerHTML="select your state";

	            state.focus();
	            ok = false;
						} else{
		            state.style.border = "0px solid red";
		            document.getElementById("state_error").innerHTML="";
		          }

	          var fname = firstname.value;
	          var alphaExp = /^([a-z]+[,.]?[ ]?|[a-z]+['-]?)+$/i;
	          if(fname == null || fname == ""){
	            firstname.style.border = "1px solid red";
	            document.getElementById("fname_error").style.color = "red";
	            document.getElementById("fname_error").innerHTML="First Name is required";

	            firstname.focus();
	            ok = false;
	          }
	          else{
	            firstname.style.border = "0px solid red";
	            document.getElementById("fname_error").innerHTML="";
	          }
	          if(!alphaExp.test(fname)){
	            firstname.style.border = "1px solid red";
	            document.getElementById("fname_error").style.color = "red";
	          document.getElementById("fname_error").innerHTML="Only Alphabets,(dot),(comma) are allowed!";
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
	            errorArray.push(mobile);
	            email.focus();
	            ok = false;
	          }
	          else{
	            email.style.border = "0px solid red";
	            document.getElementById("email_error").innerHTML="";
	          }
	          var answer1Value = ans1.value;
	          if(answer1Value == null || answer1Value == ""){
	            ans1.style.border = "1px solid red";
	            document.getElementById("ans1_error").style.color = "red";
	            document.getElementById("ans1_error").innerHTML="answer cannot be empty";
	            errorArray.push(ans1);
	            ans1.focus();
	            ok = false;
	          }
	          else{
	            ans1.style.border = "0px solid red";
	            document.getElementById("ans1_error").innerHTML="";
	          }
	          var answer2Value = ans2.value;
	          if(answer2Value == null || answer2Value == ""){
	            ans2.style.border = "1px solid red";
	            document.getElementById("ans2_error").style.color = "red";
	            document.getElementById("ans2_error").innerHTML="answer cannot be empty";
	            errorArray.push(ans2);
	            ans2.focus();
	            ok = false;
	          }
	          else{
	            ans2.style.border = "0px solid red";
	            document.getElementById("ans2_error").innerHTML="";
	          }
	          var ques1Value = ques1.value;

	          if(ques1Value == ""){
	            ques1.style.border = "1px solid red";
	            document.getElementById("ques1_error").style.color = "red";
	            document.getElementById("ques1_error").innerHTML="select anyone question";
	            errorArray.push(ques1);
	            ques1.focus();
	            ok = false;
	          }
	          else{
	            ques1.style.border = "0px solid red";
	            document.getElementById("ques1_error").innerHTML="";
	          }
	          var ques2Value = ques2.value;
	          if(ques2Value == ""){
	            ques2.style.border = "1px solid red";
	            document.getElementById("ques2_error").style.color = "red";
	            document.getElementById("ques2_error").innerHTML="select anyone question";
	            errorArray.push(ques2);
	            ques2.focus();
	            ok = false;
	          }
	          else{
	            ques2.style.border = "0px solid red";
	            document.getElementById("ques2_error").innerHTML="";
	          }
	          if(errorArray.length>0){
	            errorArray[0].focus();
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

	     return PatientValidate();
	 };

	 this.doctorValidation = function () {
		 	var firstname = document.forms["contactForm"]["contactName"];
		    var dcino = document.forms["contactForm"]["dci"];
		    var qualname = document.forms["contactForm"]["qual"];
		    var clinicaddr = document.forms["contactForm"]["clinic"];
		    var cityname = document.forms["contactForm"]["City"];
		    var pin = document.forms["contactForm"]["pin"];
		    var cmobile = document.forms["contactForm"]["cmobile"];
		    var mobile = document.forms["contactForm"]["mobile"];
		    var lastname = document.forms["contactForm"]["lastName"];
		    var date = document.forms["contactForm"]["date"];
		    var spc = document.forms["contactForm"]["spc"];
		    var hours = document.forms["contactForm"]["hours"];
		    var residential = document.forms["contactForm"]["residential"];
		    var city1name = document.forms["contactForm"]["City1"];
		    var pin1 = document.forms["contactForm"]["pin1"];
		    var cmobile1 = document.forms["contactForm"]["cmobile1"];
		    var email = document.forms["contactForm"]["email"];
		    var exp = document.forms["contactForm"]["exp"];

		      //Getting error display objects
		    var fname_error = document.getElementById("fname_error");
		    var dci_error = document.getElementById("dci_error");
		    var qual_error = document.getElementById("qual_error");
		    var claddr_error = document.getElementById("qual_error");
		    var city_error = document.getElementById("city_error");
		    var pin_error = document.getElementById("pin_error");
		    var cmobile_error = document.getElementById("cmobile_error");
		    var mobileno_error = document.getElementById("mobileno_error");
		    var lname_error = document.getElementById("lname_error");
		    var dob_error = document.getElementById("dob_error");
		    var spc_error = document.getElementById("spc_error");
		    var hours_error = document.getElementById("hours_error");
		    var addr_error = document.getElementById("addr_error");
		    var city1_error = document.getElementById("city1_error");
		    var pin1_error = document.getElementById("pin1_error");
		    var email_error = document.getElementById("email_error");
		    var cmobile1_error = document.getElementById("cmobile1_error");
		    var pin1_error = document.getElementById("exp_error");

		      // Setting Event Listeners


		      // Validation Function
		  function DoctorValidate(){

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

		      var dciValue = dcino.value;
		      if(dciValue == ""){
		        dcino.style.border = "1px solid red";
		        document.getElementById("dci_error").style.color = "red";
		        document.getElementById("dci_error").innerHTML="DCI Reg. NO is required";
		        errorArray.push(dcino);
		        dcino.focus();
		        ok = false;
		      }
		      else{
		          dcino.style.border = "0px solid red";
		        document.getElementById("dci_error").innerHTML="";
		      }
		      var qualValue = qualname.value;
		      if(qualValue == "" || qualValue == null){
		        qualname.style.border = "1px solid red";
		        document.getElementById("qual_error").style.color = "red";
		        document.getElementById("qual_error").innerHTML="Qualification is required";
		        errorArray.push(qualname);
		        qualname.focus();
		        ok = false;
		      }
		      else{
		          qualname.style.border = "0px solid red";
		        document.getElementById("qual_error").innerHTML="";
		      }
		      var claddrValue = clinicaddr.value;
		      if(claddrValue == null || claddrValue == ""){
		        clinicaddr.style.border = "1px solid red";
		        document.getElementById("claddr_error").style.color = "red";
		        document.getElementById("claddr_error").innerHTML="Clinic address is required";
		        errorArray.push(clinicaddr);
		        clinicaddr.focus();
		        ok = false;
		      }
		      else{
		          clinicaddr.style.border = "0px solid red";
		        document.getElementById("claddr_error").innerHTML="";
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
		      var expval = exp.value;
		      if(expval == ''){
		    	exp.style.border = "1px solid red";
		        document.getElementById("exp_error").style.color = "red";
		        document.getElementById("exp_error").innerHTML="Enter Experience";
		        errorArray.push(exp);
		        exp.focus();
		        ok = false;
		      }
		      else{
		        cityname.style.border = "0px solid red";
		        document.getElementById("exp_error").innerHTML="";
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
			//var contactRegex = /\d{3}([- ]*)\d{8}/; for accepting one contact number
			  var contactRegex = /^[-0-9+,]+$/;
		      var cmobileValue = cmobile.value;
		      if (!contactRegex.test(cmobileValue)){
		        cmobile.style.border = "1px solid red";
		        document.getElementById("cmobile_error").style.color = "red";
		        document.getElementById("cmobile_error").innerHTML="Enter valid contact number";
		        errorArray.push(cmobile);
		        cmobile.focus();
		        ok = false;
		      }
		      else{
		        cmobile.style.border = "0px solid red";
		        document.getElementById("cmobile_error").innerHTML="";
		      }
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
		      var spcValue = spc.value;
		      if(spcValue == "" || spcValue == null){
		        spc.style.border = "1px solid red";
		        document.getElementById("spc_error").style.color = "red";
		        document.getElementById("spc_error").innerHTML = "select anyone specialization";
		        errorArray.push(spc);
		        spc.focus();
		        ok = false;
		      }
		      else{
		        spc.style.border = "0px solid red";
		        document.getElementById("spc_error").innerHTML="";
		      }

		      var hoursValue = hours.value;
		      if (hoursValue == null || hoursValue == ""){
		        hours.style.border = "1px solid red";
		        document.getElementById("hours_error").style.color = "red";
		        document.getElementById("hours_error").innerHTML = "working hours cannot be empty";
		        errorArray.push(hours);
		        hours.focus();
		        ok = false;
		      }
		      else{
		        hours.style.border = "0px solid red";
		        document.getElementById("hours_error").innerHTML="";
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
		      var city1na = city1name.value;
		      if(!alphaExp.test(city1na)){
		        city1name.style.border = "1px solid red";
		        document.getElementById("city1_error").style.color = "red";
		        document.getElementById("city1_error").innerHTML="Enter a valid city";
		        errorArray.push(city1name);
		        city1name.focus();
		        ok = false;
		      }
		      else{
		        city1name.style.border = "0px solid red";
		        document.getElementById("city1_error").innerHTML="";
		      }
		      var zipCodeRegex = /^[1-9][0-9]{5}$/;
		      var zipCode1 = pin1.value;
		      if(!zipCodeRegex.test(zipCode)){
		        pin1.style.border = "1px solid red";
		        document.getElementById("pin1_error").style.color = "red";
		        document.getElementById("pin1_error").innerHTML="Enter valid pincode";
		        errorArray.push(pin1);
		        pin1.focus();
		        ok = false;
		      }
		      else{
		        pin1.style.border = "0px solid red";
		        document.getElementById("pin1_error").innerHTML="";
		      }
		      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		      var emailId = email.value;
		      if(!emailRegex.test(emailId)){
		        email.style.border = "1px solid red";
		        document.getElementById("email_error").style.color = "red";
		        document.getElementById("email_error").innerHTML="Enter valid email ID";
		        errorArray.push(email);
		        email.focus();
		        ok = false;
		      }
		      else{
		        email.style.border = "0px solid red";
		        document.getElementById("email_error").innerHTML="";
		      }
		      var webRegex = /(http(s)?:\\)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?/;
		      var cwebValue = cmobile1.value;
		      if(!webRegex.test(cwebValue) && cwebValue!=""){
		        cmobile1.style.border = "1px solid red";
		        document.getElementById("cmobile1_error").style.color = "red";
		        document.getElementById("cmobile1_error").innerHTML="Enter valid URL";
		        errorArray.push(cmobile1);
		        cmobile1.focus();
		        ok = false;
		      }
		      else{
		        cmobile1.style.border = "0px solid red";
		        document.getElementById("cmobile1_error").innerHTML="";
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

		 return DoctorValidate();
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

		    var hoursValue = hours.value;
		    if (hoursValue == null || hoursValue == ""){
		      hours.style.border = "1px solid red";
		      document.getElementById("hours_error").style.color = "red";
		      document.getElementById("hours_error").innerHTML = "working hours cannot be empty";
		      errorArray.push(hours);
		      hours.focus();
		      ok = false;
		    }
		    else{
		      hours.style.border = "0px solid red";
		      document.getElementById("hours_error").innerHTML="";
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
		    var endDateValue = ci.value;
		    if(endDateValue == null || endDateValue == ""){
		      ci.style.border = "1px solid red";
		      document.getElementById("ci_error").style.color = "red";
		      document.getElementById("ci_error").innerHTML = "end date is required";
		      errorArray.push(ci);
		      ci.focus();
		      ok = false;
		      }
		      else if(startDateValue>endDateValue){
		      ci.style.border = "1px solid red";
		      document.getElementById("ci_error").style.color = "red";
		      document.getElementById("ci_error").innerHTML = "End date should be greater than start date";
		      errorArray.push(mobile);
		      ci.focus();
		      ok = false;

		    }
		      else{
		      ci.style.border = "0px solid red";
		      document.getElementById("ci_error").innerHTML="";
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
