'use strict';
//MATCH MEDIA POINTS
/*
 * Функция получает значения matchMedia для соответствующих ширин экрана
 * @param {array} arr - массив со значениями match points
 * @return возвращается объект с булевыми значениями для матч поинтов
 */
function isMatchMediaArr(arr) {
  if ( !Array.isArray(arr) ) return [];
  var res = {};
  arr.forEach(function(el, i) {
    res[el] = {
    	min: window.matchMedia('(min-width:'+parseInt(el, 10)+'px)').matches,
    	max: window.matchMedia('(max-width:'+parseInt(el, 10)+'px)').matches
    }
  });
  return res;
} 
var matchMediaArr = isMatchMediaArr([430, 560, 780, 990, 1250]);
// console.log(matchMediaArr);

/*
 * Плавный скролл к элементу
 * @prarm {string|jq-object} scroll_el - элемент, к которому скролить
 * @param {number} speed - скорость анимации скрола, мс
 * @param {number} offset - отступ от верха экрана, рх
 */
function scrollTo(scroll_el, speed, offset){
	speed = speed || 800;
	offset = offset || 0;

	if ($(scroll_el).length != 0) {
		$('html, body').animate({ scrollTop: $(scroll_el).offset().top + offset }, speed);
	}
}

/**
 * Функция возвращает число с ведущим нулем, если число меньше 10
 * param {Number} num
 */
function getFirstZeroNumbers(num) {
	return ( num < 10 ) ? '0'+num : num;
}


$(function(){

	//FIX_MENU
	const winH = $(window).height(),
				fixMenu = $('#fix-menu'),
				asideWrap = $('#aside');
				
	$(fixMenu).css('display', 'block');
	$(asideWrap).css('display', 'block');

	$(window).on('load scroll', function() {
		var top = $(this).scrollTop();
		if ( top > ( winH / 3 * 2 ) ) {
			$(fixMenu).addClass('js-active');
		} else {
			$(fixMenu).removeClass('js-active');
		}
	});

	$('.js-aside-toggle').on('click', function() {
		$(asideWrap).toggleClass('js-active');
	});

	//scroll menu
	$('.js-scroll-to').click( function(){
		var href = $(this).attr('href');
		scrollTo(href, 800, -($(fixMenu).height()));
		$(asideWrap).removeClass('js-active');
		return false;
	});


	//Запрет на ввод букв в телефонах
	$('input[type="tel"]').on('keypress', function(e){
		let keyCode = e.keyCode;
		if ( (keyCode < 48 || keyCode > 57) 
					&& keyCode !== 32  //пробел
					&& keyCode !== 40 //(
					&& keyCode !== 41	//)
					&& keyCode !== 45	//-
					&& keyCode !== 43	//+
			 ) return false;
	});


	//POPUP LITY
	// документация https://sorgalla.com/lity/
	let modalLity;
	$('body').on('click', '.js-modal-open', function(event) {
		event.preventDefault();
		const href = $(this).attr('href');
		if (modalLity) modalLity.close();
		modalLity = lity(href);
	});

	// modalLity = lity('#modal-thanks');
	// setTimeout(function(){ modalLity.close(); console.log('sdf')}, 10000);


	//slider slick
	const boxWrap = $('#box');
	if(boxWrap.length){
		const slider = $(boxWrap).find('.js-slider-wrap');
		let boxSlidesCount = $(slider).children('div').length;
	
		boxSlidesCount = ( boxSlidesCount < 10 ) ? '0'+boxSlidesCount : boxSlidesCount;
	
		$(boxWrap).find('.js-slider-curr').text('0'+1);
		$(boxWrap).find('.js-slider-count').text( boxSlidesCount );
	
		$(slider).on('afterChange', function(slick, currentSlide) {
			let curr = ( (currentSlide.currentSlide + 1) < 10 ) ? '0'+(currentSlide.currentSlide + 1) : (currentSlide.currentSlide + 1);
			$(boxWrap).find('.js-slider-curr').text( curr );
		});
	
		$(slider).slick({
				prevArrow: $(boxWrap).find('.slider__arrow_prev'),
				nextArrow: $(boxWrap).find('.slider__arrow_next'),
				centerMode: true,
				centerPadding: '0',
				slidesToShow: 3,
				mobileFirst: true,
				responsive: [
					{
						breakpoint: 780,
						settings: {
							arrows: true,
							centerMode: true,
							centerPadding: '0',
							slidesToShow: 1
						}
					}
				]
		});
	}
			


	// $(window).on('scroll.test', function() {
	// 	if ( $(this).scrollTop() > (boxWrap - winH) ) {
	// 		lazyloadWalsh( $(boxWrap).find('img') );
	// 		$(window).off('scroll.test');
	// 	}
	// });


	$('.messengers').on('click', '.js-messengers-toggle', function(e){
		e.preventDefault();
		let parent = $(this).closest('.messengers');
		let input = $(parent).find('input.js-messengers-input');
		let title = $(this).attr('title');
		$(input).val(title);

		$(parent).find('.js-messengers-toggle').removeClass('js-active');
		$(this).addClass('js-active');
	});


	//Отправка заявок
	$('input[name="agree"]').on('click', function() {
		if ( $(this).prop('checked') ) {
			$(this).closest('form').find('.form__submit').removeAttr('disabled');
		} else {
			$(this).closest('form').find('.form__submit').attr('disabled', 'disabled');
		}
	});
	$('form').on('submit', function(e){
		e.preventDefault();
		
		var form = $(this),
			  submit = $(form).find('button[type=submit]');
		$(form).find('input[required]').removeClass('alert');
		$(submit).attr('disabled', 'disabled');
		
		const formSend = $.post({
			url:  $(form).attr('action'),
			data: $(form).serialize(),
		});
		formSend.done(function(dataJson){
			$(submit).removeAttr('disabled');
			
			let dataObj = JSON.parse(dataJson);
			let code = dataObj.code;
			console.log(dataObj);
			
			if (code == "100"){
				$(form).find('input[type=text]').val('');
				$(form).find('input[type=tel]').val('');

				if (modalLity) modalLity.close();
				modalLity = lity('#modal-thanks');
				setTimeout(function(){ modalLity.close(); }, 5000);
			};
			if (code == "101"){
				$(form).find('input[type=text]').val('');
				$(form).find('input[type=tel]').val('');
				alert('Сообщение не отправлено<br/>Попробуйте еще раз');
			};
			if (code == "102"){
				$(form).find('input[required]').each(function(i){
					if($(this).val() == '') $(this).addClass('alert');
				});
				alert('Заполните обязательные поля');
			};
			if (code == "103"){
				$(form).find('input[name=phone]').addClass('alert');
				alert('Неправильный номер телефона');
			};
		});
	});


	const myWidget = new MyWidget('#my-widget');
	function MyWidget(wrap){
		const btnOpen = $(wrap).find('.js-widget-open'),
			btnClose = $(wrap).find('.js-widget-close'),
			btnInfoClose = $(wrap).find('.js-widget-info-close'),
			wrapInfo = $(wrap).find('.js-widget-info'),
			btns = $(wrap).find('.js-widget-btn'),
			winH = $(window).height();

		$(btnOpen).on('click', function(e){
			e.preventDefault()
			$(wrap).addClass('active')
			$(wrapInfo).fadeOut(200)
		})
		$(btnInfoClose).on('click', function(e){
			e.preventDefault()
			$(wrapInfo).fadeOut(200)
		})
		$(btnClose).on('click', function(e){
			e.preventDefault()
			$(wrap).removeClass('active')
		})
		$(btns).on('click', function(){
			$(wrap).removeClass('active')
		})

		function _init(){
			setTimeout(function(){
				$(wrap).fadeIn(400)
			}, 5000)
		}

		// $(window).on('scroll', function onScroll() {
		//   if ($(window).scrollTop() > winH) {
		//     $(wrap).fadeIn(200);
		//     $(window).off('scroll', onScroll);
		//   }
		// });

		_init()
	}


	//LIBS
	svg4everybody();//supports svg-sprites in IE/edge

	//ленивая загрузка с viewport-ом   https://github.com/verlok/lazyload
	var lazyLoadInstance = new LazyLoad({
	    elements_selector: ".lazy"
	});
});