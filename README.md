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

1) Add the folder MADMailer to the root (or anywhere else you choose) of your project.

2) Then add the reference to the JS file (within MADMailer/src/js) in your HTML file, for example:

    <script src="MADMailer/src/js/MADMailer.js" type="text/javascript"></script>

3) On document ready event initialize the MADMailer with your options.

    $(document).ready(function(){
  	    MADMailer.init({
  	    	mail_template_uri: 'http://www.yourdomain.com/email-templates/some-email-template.html',
  	    	mail_subject: 'Lorem Ipsum Dolor',
  	    	mail_from: {email:'no-reply@yourdomain.com', name:'Lorem Ipsum'},
  	    	mail_to: [],
  	    	mail_cc: [],
  	    	mail_bcc: [
  	    			{email: 'johndoe@email.com', name:'John Doe' },
  	    			{email: 'janedoe@email.com', name:'Jane Doe' }
  	    	],
  	    	button: '#button-madmailer',
  	    	form: '#form-contact',
  	    	activity_indicator: '.activity-indicator',
  	    	success_notification: '#notification-success',
  	    	error_notification: '#notification-error'
  	    });
    });

4) Create your Email Template.  To add data enterred into your form fields into your email when sent, place the field id within two "%" symbols inside your template.
    - i.e.: %my-input-element-id%
    - see example/email-templates/lorem-ipsum.html
    
5) To send the mail to an email address entered into a field, add the data attribute 'data-mail-to="true"' to the element.
    

Properties
--------------
- mail_template_uri:    (String) the absolute path to your email template
    
- mail_subject:     (String) the subject of your email
    
- mail_from:    (object) the email address and name of the who the email is coming from

        mail_from: {email:'no-reply@yourdomain.com', name:'Lorem Ipsum'},
    
- mail_to: (array of objects) the email address(es) and name(s) of the who the email is to

        mail_to: [
      	   {email: 'johndoe@email.com', name:'John Doe' },
      	   {email: 'janedoe@email.com', name:'Jane Doe' }
        ]
  	    	
- mail_cc: (array of objects) the email address(es) and name(s) of people to be cc'd  **optional**

        mail_cc: [
      	    {email: 'johndoe@email.com', name:'John Doe' },
      	    {email: 'janedoe@email.com', name:'Jane Doe' }
        ]

- mail_bcc: (array of objects) the email address(es) and name(s) of people to be bcc'd  **optional**

        mail_bcc: [
      	    {email: 'johndoe@email.com', name:'John Doe' },
      	    {email: 'janedoe@email.com', name:'Jane Doe' }
        ]
  	    	
- button: (String) the selector for the button that will initiate the send mail action; it will be replaced by any element specified in activity_indicator below. 
    
- form: (String) the selector for the form (or any element) containing your input elements. 
    
- activity_indicator:  (String) the selector for any activity indicator you wish to show during the send mail operation
    
- success_notification: (String) the selector for the element that will show upon successful send mail
    
- error_notification: (String) the selector for the element that will show upon error; should be empty div; any content will be replaced with error notification
 
Demo
--------------
http://dev.madstudios.net/kelsey/projects/Library/MADMailer/example/
