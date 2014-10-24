MADMailer
=========

Send emails corresponding to any form (or any element containing input or textarea elements). 
Allows you to create your own email templates with variable data from your form fields.

Dependencies
--------------
Requires JQuery 1.6+


Adding MADMailer to your Project
--------------

To add MADMailer to your projects...

1) Add the reference to your HTML file, for example:

    <script src="MADMailer/src/js/MADMailer.js" type="text/javascript"></script>

2) On document ready event initialize the MADMailer with your options.

    $(document).ready(function(){
  	    MADMailer.init({
  	    	//URI of your HTML email template
  	    	//use absolute path here
  	    	mail_template_uri: 'http://www.yourdomain.com/email-templates/some-email-template.html',
  	    	mail_subject: 'Lorem Ipsum Dolor',
  	    	mail_from: {email:'no-reply@yourdomain.com', name:'Lorem Ipsum'},
  	    	mail_to: [],
  	    	mail_cc: [],
  	    	mail_bcc: [
  	    			//{email: 'johndoe@email.com', name:'John Doe' },
  	    			//{email: 'janedoe@email.com', name:'Jane Doe' }
  	    	],
  	    	//selector for element that will 
  	    	//send mail upon click
  	    	button: '#button-madmailer',
  	    	//selector for form element that contains 
  	    	//data to be sent in mail
  	    	form: '#form-contact',
  	    	//selector for an optional
  	    	//activity indicator that will replace
  	    	//the button while send mail is in progress
  	    	activity_indicator: '.activity-indicator',
  	    	//selector for the element that will 
  	    	//show upon email send success
  	    	success_notification: '#notification-success',
  	    	//selector for the element that will 
  	    	//show upon form validation 
  	    	// or email send error
  	    	error_notification: '#notification-error'
  	    });
    });
    
    3) Create your Email Template.  To add data enterred into your form fields into your email when sent, place the field id within two "%" symbols inside your template.
    - i.e.: %my-input-element-id%
    - see example/email-templates/lorem-ipsum.html
    
    4) To send the mail to an email address enterred into a field, add the data attribute 'data-mail-to="true"' to the element.
    
 
Demo
--------------
http://dev.madstudios.net/kelsey/projects/Library/MADMailer/example/
