<?php 
require_once 'PHPMailer/Exception.php';
require_once 'PHPMailer/PHPMailer.php';
require_once 'vendor/validatePostData/ValidatePostData.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use validatePostData\ValidatePostData;


//  ПОДГОТОВИТЕЛЬНЫЕ ДАННЫЕ
//  Массив получаемый от формы
$userData = new ValidatePostData();

/**
 *  метод add принимает три параметра
 *  1 - название ключа в массиве POST
 *  2 - человекопонятный заголовок ключа
 *  3 - фильтр для валидации, по - умолчанию строки, варианты 'phone', 'email', 'array'
 */
$userData->add('name', 'Имя');
$userData->add('phone', 'Телефон', 'phone');
$userData->add('email', 'Email', 'email');
$userData->add('title', 'Заполнена форма');
$userData->add('array', 'Какой-то заголовок', 'array');
$userData->add('orderfk', 'Пустота');

if ( !empty($userData->get('orderfk')['value']) ) die();

$response = [];     // Возвращаемый массив ответов по ajax - инициализируем
$responseError = [  // коды ответов для js 
    100 => [
        'code' => 100,
        'text' => 'сообщение отправлено'
    ],
    101 => [
        'code' => 101,
        'text' => 'сообщение не отправлено'
    ],
    102 => [
        'code' => 102,
        'text' => 'заполнены не все поля'
    ],
    103 => [
        'code' => 103,
        'text' => 'неправильный email'
    ],
    104 => [
        'code' => 104,
        'text' => 'неправильный номер телефона'
    ],
];

     
/*  Проверяем правильность ввода телефона */
if ( !$userData->get('phone')['value'] ) {
    $response = $responseError[104];    //неправильный телефон
} else {

    /* Формируем сообщение */
    $message = '<table>';
    $tdStyle = 'vertical-align: top;padding: 10px 20px 5px 0;border-bottom: 1px solid #ddd';
    foreach ($userData->getAll() as $input) {

        if ( empty($input['value']) ) continue;

        $message .= '<tr>';
        $message .= '<td style="'.$tdStyle.'">'. $input['title'] . '</td>';
        $message .= '<td style="'.$tdStyle.'">';

        if (is_array($input['value'])) {
            $message .= '- '. implode(';<br>- ', $input['value'] );
        } else {
            $message .= $input['value'];
        }
        
        $message .= '</td></tr>';
    }
    $message .= '</table>';
 

    $mail = new PHPMailer;

    $mail->setFrom('info@leem-one.ru', '');
    $mail->addAddress('irbisant@mail.ru');

    $mail->isHTML(true);
    $mail->CharSet = "utf-8";
    $mail->Port = 587;
    $mail->SMTPSecure = 'tls';

    $mail->Subject = "Заявка с сайта";
    $mail->Body = $message;

    if(file_exists($_FILES['fileupload']['tmp_name'])){
        $mail->AddAttachment($_FILES['fileupload']['tmp_name'], $_FILES['fileupload']['name']);
    }

    /* Отправка сообщения */         
    if  ( $mail->send() ){
        $response = $responseError[100];  //сообщение отправлено
    }else{
        $error[] = $mail->ErrorInfo;
        $response = $responseError[101];     //сообщение не отправлено
    };
}

echo json_encode($response);