<?php
namespace validatePostData;

/**
 * 
 */

class ValidatePostData
{

    /**
     * Массив данных, полученых извне PHP
     * $postData - содержит массивы данных 
     * $name - ключ $_REQUEST
     * $title - заголовок
     * $value - значение $_REQUEST
     */
    protected $postData = [];


    /**
     * Одна из констант INPUT_GET, INPUT_POST
     */
    public static $typeRequest = INPUT_POST;

    /**
     *Фильтр для телефона
     */
    const FILTERPHONE = [
      'filter' => FILTER_VALIDATE_REGEXP,
      'options' => [
              'regexp' => '/^[0-9\s\(\)\+\-]{1,18}$/'
      ]
  ];

    /**
     * Фильтр для email
     */
    const FILTEREMAIL = [
      'filter' => FILTER_VALIDATE_REGEXP,
      'options' => [
              'regexp' => '/[0-9a-z_\-]+@[0-9a-z_^\.]+\.[a-z]{2,3}/i'
      ]
  ];

    /**
     * Фильтр для массива
     */
    const FILTERARRAY = [
      'filter' => FILTER_SANITIZE_STRING,
      'flags'  => FILTER_REQUIRE_ARRAY,
  ];
    

    /**
     * Получение данных извне, фильтрация и добавление Заголовка
     * $name - название ключа, получаемого через POST, GET
     * $title - заголовок
     * $filter - Идентификатор (ID) применяемого фильтра
     *         - или отдельно для номера телефона FILTERPHONE
     *         - или для адреса почты FILTEREMAIL
     */
    public function add($name, $title = '', $filter = FILTER_SANITIZE_STRING)
    {

        switch ($filter) {

            case 'phone':
                $this->postData[$name] = [
                    'title' => $title,
                    'value' => filter_input($this::$typeRequest, $name, FILTER_DEFAULT, self::FILTERPHONE)
                ];
                break;

            case 'email':
                $this->postData[$name] = [
                    'title' => $title,
                    'value' => filter_input($this::$typeRequest, $name, FILTER_DEFAULT, self::FILTEREMAIL)
                ];
                break;

            case 'array':
                $this->postData[$name] = [
                    'title' => $title,
                    'value' => filter_input($this::$typeRequest, $name, FILTER_DEFAULT, self::FILTERARRAY)
                ];
                break;
            
            default:
                $this->postData[$name] = [
                    'title' => $title,
                    'value' => filter_input($this::$typeRequest, $name, $filter)
                ];
                break;
        }
    }


    /**
     * Вывод всех ключей
     * @return Array
     */
    public function getAll()
    {
        return $this->postData;
    }


    /**
     * Вывод значения по ключу
     */
    public function get($name)
    {

        if ( array_key_exists($name, $this->postData) )
        {
            return $this->postData[$name];
        } else return false;

    }

    /**
     * Добавление или переопределение значения в общий массив
     */
    public function addCustomField($name, $value, $title = false)
    {
        $this->postData[$name]['value'] = $value;

        if ($title) {
            $this->postData[$name]['title'] = $title;
        }
    }
}