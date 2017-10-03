<?php 
header('Content-type: text/html; charset=utf-8');

	$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
	$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
	$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_STRING);
	$title = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
	
	$response = array();
	$responseError = array(
		100 => array(
			'code' => 100,
			'text' => 'сообщение отправлено'
		),
		101 => array(
			'code' => 101,
			'text' => 'сообщение не отправлено'
		),
		102 => array(
			'code' => 102,
			'text' => 'заполнены не все поля'
		),
		103 => array(
			'code' => 103,
			'text' => 'неправильный email'
		),
		104 => array(
			'code' => 104,
			'text' => 'неправильный номер телефона'
		),
		
	);
	 
	/* Проверяем заполнены ли все поля */
	if( !empty($name) && !empty($email) && !empty($phone) ){
	 
		/*  Проверяем правильность ввода email-адреса */
		if( !filter_var($email, FILTER_VALIDATE_EMAIL) ){
			$response = $responseError[103];	//неправильный email
		}else if( !filter_var($phone, FILTER_VALIDATE_REGEXP, 
					[
							'flags' =>'', 
							'options' => [
									'regexp' => '/^[0-9\s\(\)\+\-]{1,18}$/'
							]
					]
				) )
		{
			$response = $responseError[104];	//неправильный телефон
		}else{
	 
			/* Формируем сообщение */
			require_once('class.phpmailer.php');
			$mail = new PHPMailer;

			$mail->setFrom('info@leem-one.ru', 'SITE');
			$mail->addAddress('irbisant@mail.ru');
			//$mail->addReplyTo('user@email3.com','Slava');

			$mail->isHTML(true);
			$mail->CharSet = "utf-8";
			$mail->Port = 587;
			$mail->SMTPSecure = 'tls';

			$mail->Subject = "Заявка с сайта ";
			$mail->Body = "<p>Имя: <strong>$name</strong><br>Email: <strong>$email</strong><br>Телефон: <strong>$phone</strong></p><p>Заполнена форма: $title</p>";

			if(file_exists($_FILES['userfile']['tmp_name'])){
				$mail->AddAttachment($_FILES['userfile']['tmp_name'], $_FILES['userfile']['name']);
			}

			/* Отправка сообщения */		 
			if  ( $mail->send() ){
				$response = $responseError[100];  //сообщение отправлено
			}else{
				$error[] = $mail->ErrorInfo;
				$response = $responseError[101];	 //сообщение не отправлено
			};
		}
	}else{
		$response = $responseError[102]; //заполнены не все поля;
	}
	
	echo json_encode($response);