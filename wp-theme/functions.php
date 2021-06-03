<?php
	define('WP_THEME', get_template_directory_uri());

	add_filter('show_admin_bar', '__return_false');


	add_theme_support( 'post-thumbnails' );
	// add_image_size( 'used-thumb', 200, 150 );

	add_theme_support( 'menus' );
	add_theme_support( 'custom-logo' );
	add_theme_support('title-tag');
	add_theme_support('widgets');


	add_action( 'wp_enqueue_scripts', function() {
		wp_enqueue_style( 'libs', WP_THEME.'/css/libs.min.css', [], '1.0.1' );
		wp_enqueue_style( 'main', WP_THEME.'/css/style.min.css', [], '1.0.4' );
		wp_enqueue_style( 'theme', get_stylesheet_uri(), [], '1.0.1' );

		wp_deregister_script( 'jquery' );
		wp_enqueue_script( 'jquery', WP_THEME.'/js/libs.min.js', false, '1.0.2', true );
		wp_enqueue_script( 'main', WP_THEME.'/js/custom.js', false, '1.0.2', true );

		// wp_enqueue_script( 'myajax', WP_THEME.'/js/my-ajax.js', ['jquery'], '1.0.2', true );
		// wp_localize_script( 'main', 'myajax', [
		// 	'url' => admin_url('admin-ajax.php'),
		// 	'nonce' => wp_create_nonce('ajax-nonce')
		// ]); 
	});
		

	add_action( 'wp_head', 'wp_site_icon', 99 );
	$site_icon_id = get_option( 'site_icon' );
	// add_theme_support( 'custom-logo' );


	/**
	 * Функция очищает номер телефона от (,),-,+,пробелов
	 * return {string} в формате +78912345678
	 */
	function clearPhone ($phone) {
		return '+'.str_replace(['(', ')', ' ', '+', '-'], '', $phone);
	}


		/**
	 * Получаем настройку get_custom() из кеша, если оно там есть
	 * $key {string} - ключ нстройки
	 */
	function getCachedCustom($key) {
		// пробуем получить кэш и вернем его если он есть
		$cache_key = $key;
		if( $cache = wp_cache_get( $cache_key ) )
			return $cache;

		//если в кеше нет, то получаем и пишем в кеш
		$custom = get_custom($key);
		wp_cache_set( $cache_key, $custom ); // добавим данные в кэш

		return $custom;
	}