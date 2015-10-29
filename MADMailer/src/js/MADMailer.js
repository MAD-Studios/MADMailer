//handle console statements in old ie
if (!window.console) {var console = {};}
if (!console.log) {console.log = function() {};}

MADMailer = {
	SEND_MAIL_URI: 'php/send-mail.php',
	RED_CLASS: "red",
	PADDING: 80,
	SUCCESS_NOTIFICATIONS: {
		DEFAULT: "Request sent Successfully."
	},
	ERROR_NOTIFICATIONS: {
		DEFAULT: "There was an error sending your request.  Please try again.",
		NO_FORM_SELECTOR: "Please specify a form.",
		BTN_FORM_SELECTOR: "Please specify a button.",
	},
	VALIDATION_ERROR_NOTIFICATIONS: {
		INVALID: 'Please complete all required fields.',
		INVALID_EMAIL: 'Please enter a valid email.'
	},
	success_notification_is_shown: false,
	error_notification_is_shown: false,
	//--------------------------------------
	// init
	//--------------------------------------
	init: function(mail_obj){
		//get the directory of this 
		this.mail_obj = mail_obj;
		//file
		var self = this;
		setTimeout(function(){
			self.initUI();
		} ,100);
	},
	//--------------------------------------
	// initUI
	//--------------------------------------
	initUI: function(){
		var self = this;
		var src, ind;
		//load the activity indicator
		if(this.mail_obj.activity_indicator && $(this.mail_obj.activity_indicator)) this.activity_indicator_el = $(this.mail_obj.activity_indicator);
		if(this.mail_obj.button && $(this.mail_obj.button)) this.button_el = $(this.mail_obj.button);
		if(this.mail_obj.success_notification && $(this.mail_obj.success_notification)) this.success_notification_el = $(this.mail_obj.success_notification);
		if(this.mail_obj.error_notification && $(this.mail_obj.error_notification)) this.error_notification_el = $(this.mail_obj.error_notification);
		
		if(this.button_el){
			//add the click handler
			$(this.mail_obj.button).click(function(){
			    if(self.activity_indicator_el) self.showActivityIndicator();
				self.sendMail();
				return false;
			});
		}
		
		//for(script in scripts){
		$('script').each(function(){
			//if the src id the src of this file 
			// get the str that preceeds it
			src = $(this).attr('src');
			if(typeof src !== "undefined") {
				ind = src.indexOf('js/MADMailer.js');
				if(ind > -1) {
					self.base_dir = src.substr(0, ind);
				}
			}
		});
		this.full_send_email_uri = this.base_dir + this.SEND_MAIL_URI;
	},
	//--------------------------------------
	// sendMail
	//--------------------------------------
	sendMail: function(){
		var self = this;
		var html;
		var to_obj;
        var from_obj;
        var reg_exp;
        var i;
		this.clearErrors();
		this.hideSuccessNotification();
		//mail_obj format
		/*{ 
			form: '',
			email_title: '',
			email_to: '',
			email_from: '',
			error_notification: '',
			success_notification_slector: ''
		}*/
		if(this.mail_obj.form && $(this.mail_obj.form)){
	
			var is_valid = this.validate(this.mail_obj.form);
			
			if(is_valid == true){
				//the params object 
				//sent as ajax data
				var params = {
					subject: this.mail_obj.mail_subject || "",
					to: this.mail_obj.mail_to || [],
					cc: this.mail_obj.mail_cc || [],
					bcc: this.mail_obj.mail_bcc || [],
					from: this.mail_obj.mail_from || {},
					template_uri: this.mail_obj.mail_template_uri
				};
				
				//traverse each input of the form
				$(this.mail_obj.form  + ' input').each(function(){
				 	//if the element has
				 	//the data-mail-to attribute
				 	//set to true set the to param 'to'
				 	//to its value
				 	if($(this).data('mail-to') == true){
				 	   if(!to_obj) to_obj = {};
				 	   to_obj.email = $(this).val().trim();
				 	} 
				 	if($(this).data('mail-to-name') == true) {
				 	   if(!to_obj) to_obj = {};
				 	   to_obj.email = $(this).val().trim();
                    }
                    if($(this).data('mail-from') == true){
                       if(!from_obj) from_obj = {};
				 	   from_obj.email = $(this).val().trim(); 
                    } 
                    if($(this).data('mail-from-name') == true){
                        if(!from_obj) from_obj = {};
				 	   from_obj.email = $(this).val().trim();
                    }
                    
					//for each input
					//addd the val to an object
					params[$(this).attr("id")] = $(this).val().trim();
					
					//traverse each item
					//of this.mail_obj
					//if any contains the id
					//of this input within %%
					//then replace it with the value 
					//of this input
					reg_exp = new RegExp("%" + $(this).attr("id") + "%","g");
                    params.subject = params.subject.replace(reg_exp, $(this).val().trim());
					for(i=0;i<params.to.length;i++){
    					if(params.to[i].email) params.to[i].email = params.to[i].email.replace(reg_exp, $(this).val().trim());
                        if(params.to[i].name) params.to[i].name = params.to[i].name.replace(reg_exp, $(this).val().trim());
					}
					for(i=0;i<params.cc.length;i++){
    					if(params.cc[i].email) params.cc[i].email = params.cc[i].email.replace(reg_exp, $(this).val().trim());
                        if(params.cc[i].name) params.cc[i].name = params.cc[i].name.replace(reg_exp, $(this).val().trim());
					}
					for(i=0;i<params.bcc.length;i++){
    					if(params.bcc[i].email) params.bcc[i].email = params.bcc[i].email.replace(reg_exp, $(this).val().trim());
                        if(params.bcc[i].name) params.bcc[i].name = params.bcc[i].name.replace(reg_exp, $(this).val().trim());
					}
                    if(params.from.email) params.from.email = params.from.email.replace(reg_exp, $(this).val().trim());
                    if(params.from.name) params.from.name = params.from.name.replace(reg_exp, $(this).val().trim());
				});
				$(this.mail_obj.form + ' textarea').each(function(){
					html = $(this).val();
					html = html.replace(/(?:\r\n|\r|\n)/g, '<br />');
					params[$(this).attr("id")] = html;
				});

				//if we have a to_obj
				//and make sur eit has an email 
				//value aassociated with it
				if(to_obj && to_obj.email) {
    				if(!to_obj.name) to_obj.name = "";
                    params.to = [ to_obj ];
				}
				if(from_obj && from_obj.email) {
				    if(!from_obj.name) from_obj.name = "";
                    params.from = from_obj;
				}

				//ajax call
				$.ajax({
					type: 'POST',
					url: this.full_send_email_uri,
					data: params,
					dataType: 'json',
					success: function(data){	
						if(data.success){
                            self.hideActivityIndicator();
							self.showSuccessNotification();
							self.clearForm();
						}
						else{
							self.showErrorNotification(self.ERROR_NOTIFICATIONS.DEFAULT);
						}
					},
					error: function(data){
						self.showErrorNotification(self.ERROR_NOTIFICATIONS.DEFAULT);
					}
				});
			}
			else{
				self.showButton(); 
				self.showErrorNotification(is_valid);
			}
		}
		else{
			//show error 
			//specify a form selector
			self.showErrorNotification(self.ERROR_NOTIFICATIONS.NO_SELECTOR);
		}
	},
	//--------------------------------------
	// showSuccessNotification
	//--------------------------------------
	showSuccessNotification: function(){
		//show & focus in on the 
		//element of success selector
		if(this.success_notification_el){
			this.success_notification_el.css('opacity', '0');
			this.success_notification_el.css('display', 'block');
			//fade in now
			this.success_notification_el.animate({
			    opacity: 1
			 }, 500, "linear", function() {
			    //complete
			 });
		}
		this.success_notification_is_shown = true;
		//get the offset position 
		//of the element
		var offset = this.success_notification_el.offset();
		//get the window scroll position
		var window_scroll_top = $(window).scrollTop();
        var to_scrollTop = window_scroll_top;

		if(window_scroll_top > offset.top ){
			//set the scrolltop to offset.top + PADDING
			to_scrollTop = offset.top - this.PADDING;
		}
		else if( (window_scroll_top+$(window).height()) < offset.top ){
			to_scrollTop = offset.top - $(window).height() + this.PADDING;
		}
        $(window).scrollTop(to_scrollTop);
	},
	//--------------------------------------
	// hideSuccessNotification
	//--------------------------------------
	hideSuccessNotification: function(){
		//if shown
		if(this.success_notification_is_shown){
			if(this.success_notification_el){
				this.success_notification_el.animate({
				    opacity: 0
				}, 500, "linear", function() {
				    //complete
				    $(this).css('display', 'block');
				});
			}
			this.success_notification_is_shown = false;
		}
	},
	//--------------------------------------
	// showErrorNotification
	//--------------------------------------
	showErrorNotification: function(error){
		var self = this;
		//set the text of the element with
		//the error selector
		//show & focus in on the error
		if(this.error_notification_el){
			this.error_notification_el.addClass(this.RED_CLASS);
			this.error_notification_el.css('opacity', '0');
			this.error_notification_el.css('display', 'block');
			//fade in now
			this.error_notification_el.html(error);
			this.error_notification_el.animate({
			    opacity: 1
			}, 500, "linear", function() {
			    //complete
			});
			
			this.error_notification_el.offset(); 
		}
		this.error_notification_is_shown = true;
		//get the offset position 
		//of the element
		var offset = this.error_notification_el.offset();
		//get the window scroll position
		var window_scroll_top = $(window).scrollTop();
		var to_scrollTop = window_scroll_top;
		
		if(window_scroll_top > offset.top ){
			//set the scrolltop to offset.top + PADDING
			to_scrollTop = offset.top - this.PADDING;
		}
		else if( (window_scroll_top+$(window).height()) < offset.top ){
			//set the scrolltop to window.height() - offset.top - PADDING
			to_scrollTop = offset.top - $(window).height() + this.PADDING;
		}
		$(window).scrollTop(to_scrollTop);
	},
	//--------------------------------------
	// hideSuccessNotification
	//--------------------------------------
	hideErrorNotification: function(){
		//if shown
		if(this.error_notification_is_shown){
			if(this.error_notification_el){
				this.error_notification_el.animate({
				    opacity: 0
				}, 500, "linear", function() {
				    //complete
				    $(this).css('display', 'block');
				});
			}
			this.error_notification_is_shown = false;
		}
	},
	//--------------------------------------
	// showActivityIndicator
	//--------------------------------------
	showActivityIndicator: function(){
		var self = this;
		clearTimeout(this.showButtonTimeout);
		clearTimeout(this.showActivityIndicatorTimeout);
		//hide the button
		//so that use can't reclick it
		//and so that the activity 
		//can replace it, if one
		//was specified
		this.hideButton();
		
		this.showActivityIndicatorTimeout = setTimeout(function(){
			//replace the button with 
			//the activity indicator
			self.completeShowActivityIndicator();
		}, 500);
	},
	//--------------------------------------
	// completeShowActivityIndicator
	//--------------------------------------
	completeShowActivityIndicator: function(){
		if(this.activity_indicator_el){
			this.activity_indicator_el.css('display', 'block');
			this.activity_indicator_el.css('opacity', '0');
			this.activity_indicator_el.animate({
				    opacity: 1
			}, 500, "linear", function() {
			   //complete
			});
		}
	},
	//--------------------------------------
	// hideActivityIndicator
	//--------------------------------------
	hideActivityIndicator: function(){
		var self = this;
		if(self.activity_indicator_el){
			self.activity_indicator_el.animate({
				    opacity: 0
			}, 500, "linear", function() {
			   //complete
			   $(this).css('display', 'none');
			   	self.showButton();
			});
		}
	},
	//--------------------------------------
	// showButton
	//--------------------------------------
	showButton: function(){
		clearTimeout(this.showButtonTimeout);
		clearTimeout(this.showActivityIndicatorTimeout);
		var self = this;
		var delay = false;
		//if activity indicator
		if(this.activity_indicator_el){
			delay = true;
			this.hideActivityIndicator();
		
    		if(delay){
    			this.showButtonTimeout = setTimeout(function(){
    				self.completeShowButton();
    			}, 500);
    		}
    		else this.completeShowButton();	
		}	
	},
	//--------------------------------------
	// completeShowButton
	//--------------------------------------
	completeShowButton: function(){
		if(this.button_el){
			this.button_el.css('display', 'block');
			this.button_el.animate({
				    opacity: 1
			}, 500, "linear", function() {
			   //complete
			});
		}
	},
	//--------------------------------------
	// hideButton
	//--------------------------------------
	hideButton: function(){
		if(this.button_el){
			this.button_el.animate({
				    opacity: 0
			}, 500, "linear", function() {
			   //complete
			   $(this).css('display', 'none');
			});
		}
	},
	//--------------------------------------
	// clearForm
	//--------------------------------------
	clearForm: function(){
		//clear the value of 
		//each input and textarea
		$(this.mail_obj.form  + ' input').each(function(){
			$(this).val("");
		});
		$(this.mail_obj.form  + ' textarea').each(function(){
			$(this).val("");
		});
	},
	//--------------------------------------
	// clearErrors
	//--------------------------------------
	clearErrors: function(){
		var self = this;
		//hide the error notification
		//remove all red classes 
		//form inputs and text areas
		this.hideErrorNotification();
		$(this.mail_obj.form  + ' input').each(function(){
			$(this).removeClass(self.RED_CLASS);
		});
		$(this.mail_obj.form  + ' textarea').each(function(){
			$(this).removeClass(self.RED_CLASS);
		});
	},
	//--------------------------------------
	// validate
	// - checks Form Validity
	//--------------------------------------
	validate: function(formSelector){
		var self = this;
		var emptyFieldCount = 0;
		var invalidEmailCount = 0;
		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var is_valid = true;
		$(formSelector + ' :input').each(function(index){
			if ( $(this).hasClass('required') || $(this).attr('required') )
			{
				if ($.trim($(this).val()) == '')
				{
					$(this).addClass(self.RED_CLASS);
					is_valid = self.VALIDATION_ERROR_NOTIFICATIONS.INVALID;
				}
			}
			
			if ($(this).attr('type') == 'text' && ( ($(this).attr('name') && $(this).attr('name').search(/email/i) !== -1) || ($(this).attr('id') && $(this).attr('id').search(/email/i) !== -1) || ($(this).attr('class') && $(this).attr('class').search(/email/i) !== -1) ) && $.trim($(this).val()) != '')
			{
				if (!emailRegex.test($(this).val()))
				{
					$(this).addClass(self.RED_CLASS);
					is_valid = self.VALIDATION_ERROR_NOTIFICATIONS.INVALID_EMAIL;
				}
			}
		});
		return is_valid;
	}
};
