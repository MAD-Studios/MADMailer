<?php
require_once('PHPMailer.php');

//------------------- sendEmail
function sendMail($from, $to, $subject, $message, $cc = '', $bcc = '')
{
	$mail = new PHPMailer;	
	$mail->SetFrom($from['email'], $from['name']);
	$mail->AddReplyTo($from['email'], $from['name']);
	foreach ($to as $data) $mail->AddAddress(trim($data['email']), trim($data['name']));
	if ($cc) foreach ($cc as $data) $mail->AddCC(trim($data['email']), trim($data['name']));
	if ($bcc) foreach ($bcc as $data) $mail->AddBCC(trim($data['email']), trim($data['name']));
		
	$mail->WordWrap = 50;

	$mail->IsHTML(true);
	
	$mail->Subject = $subject;
	$mail->Body = $message;
	$mail->AltBody = $message;

	if (!$mail->send()){ echo json_encode(array('error' => 'error sending mail')); }
	else { echo json_encode(array('success' => 'success sending mail')); }
}


try{
	//compare script name
	//$_SERVER['SCRIPT_FILENAME']
	//to the file specified
	//!!!!!!!!!!!!!!!!!!!!!!!!!!
	$body = file_get_contents($_POST['template_uri']);
}
catch(Exception $e){
	echo json_encode(array('error' => $e->getMessage()));
} 

$from = $_POST['from'];
$to = $_POST['to'];
$cc = $_POST['cc'];
$bcc = $_POST['bcc'];
$subject = $_POST['subject'];

//traverse post vars
foreach ( $_POST as $key => $value ){
	//if the  value of teh post var 
	//matches a var in the email template
	//replace it
	if($key != 'template_uri' && $key != 'from' && $key != 'to' && $key != 'cc' && $key != 'bcc' && $key != 'subject'){ 
		$body = str_replace('%'.$key.'%', $value, $body);
	}
}

sendMail($from, $to, $subject, $body, $cc, $bcc);

?>