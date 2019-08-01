<?php

	require_once 'vendor/validatePostData/ValidatePostData.php';

	use validatePostData\ValidatePostData;

	$userData = new ValidatePostData();
	$userData::$typeRequest = INPUT_GET;

	$userData->add('name', 'Email', 'email');//Получение ПОСТ данных из формы (ключ POST/GET, Заголовок, фильтр валидации)

	$userData->addCustomField('custom', 111, 'Custom');

	// echo $userData->get('name')['title'] . ': ' . $userData->get('name')['value'];

	echo '<pre>';
	var_dump($userData->getAll());
	echo '</pre>';