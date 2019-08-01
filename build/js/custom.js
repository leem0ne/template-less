//MATCH MEDIA POINTS
function isMatchMediaArr(arr) {
  if ( !Array.isArray(arr) ) return {};
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


function scrollTo(scroll_el, speed, offset){
	let speed = speed || 800,
			offset = offset || 0;

	if ($(scroll_el).length != 0) {
		$('html, body').animate({ scrollTop: $(scroll_el).offset().top + offset }, speed);
	}
}


$(document).ready(function(){

	svg4everybody();//supports svg-sprites in IE/edge

	//ленивая загрузка изображений https://davidwalsh.name/lazyload-image-fade
	//используется для изображений в слайдерах, чтобы слайдеры при инициализации правльно расчитывали размеры
	[].forEach.call(document.querySelectorAll('.lazyload'), function(img) {
	  img.setAttribute('src', img.getAttribute('data-src'));
	  img.onload = function() {
			img.removeAttribute('data-src');
	  };
	});

	//ленивая загрузка с viewport-ом   https://github.com/verlok/lazyload
	// var lazyLoadInstance = new LazyLoad({
	//     elements_selector: ".lazy"
	// });


	//FIX_MENU
	const winH = $(window).height(),
				fixMenu = $('#fix-menu');
	$(window).on('load scroll', function() {
		var top = $(this).scrollTop();
		if ( top > ( winH / 3 ) ) {
			$(fixMenu).addClass('fix-menu_show');
		} else {
			$(fixMenu).removeClass('fix-menu_show');
		}
	});

	$('.burger').on('click', function() {
		if ( $(this).hasClass('burger_active') ) {
			$(this).removeClass('burger_active');
			$(fixMenu).removeClass('fix-menu_show');
		} else {
			$(this).addClass('burger_active');
			$(fixMenu).addClass('fix-menu_show');
		}
	});

	//scroll menu
	$('.nav__link').click( function(){
		var href = $(this).attr('href');
		scrollTo(href);
		if ( $('.toggle').is(':visible') )
			$('#top-menu').css('display', '');
		return false;
	});


	//POPUP LITY
	// документация https://sorgalla.com/lity/
	let modalLity;
	$('.catalog__popup, .keyses__btn').on('click', function(event) {
		event.preventDefault();

		const href = $(this).attr('href');
		modalLity = lity(href);
	});

	// modalLity = lity('#modal-thanks');
	// setTimeout(function(){ modalLity.close(); console.log('sdf')}, 10000);


	//slider slick
	var sliderWrap = $('#slider'),
			slider = $(sliderWrap).find('.slider');

	$(sliderWrap).find('.slider__curr').text(1);
	$(sliderWrap).find('.slider__count').text( $(slider).find('.slider__slide').length );

	$(slider).on('afterChange', function(slick, currentSlide) {
		$(sliderWrap).find('.slider__curr').text( currentSlide.currentSlide + 1 );
	});

	$(slider).slick({
	    prevArrow: $(sliderWrap).find('.slider__arrow_prev'),
	    nextArrow: $(sliderWrap).find('.slider__arrow_next'),
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


	/**
	*  инициализация слайдера Slick Slider с отображением панели текущегослайда / количество слайдов
	*  wrapper - оболочка элементов слайдера
	*  options - настройки SLICK slider

	*  Зависимости jQuery, Slick Slider
	**/
	function initMySlider(wrapper, options) {
		const slider = $(wrapper).find('.slider__wrap');//оболочка элементов слайдера
		const slides = $(slider).children('div');//слайды
		const prev = $(wrapper).find('.slider__arrow_prev');//Кнопка Назад
		const next = $(wrapper).find('.slider__arrow_next');//Кнопка Вперед
		const curr = $(wrapper).find('.slider__curr');//Блок номера текущего слайда
		const count = $(wrapper).find('.slider__count');//Блок количества слайдов

		let countSlides = slides.length;//количество слайдов


		//Инициализация слайдера
		const slickInit = function() {

			if ( options.arrows == undefined || options.arrows == true ) {
				options.prevArrow = prev;
				options.nextArrow = next;
			}

			$(slider).slick(options);
		}


		//инициализация объекта
		const init = function(){
			slickInit();
		}
		$('/').hover(function() {
			/* Stuff to do when the mouse enters the element */
		}, function() {
			/* Stuff to do when the mouse leaves the element */
		});


		//инициализация инфо табло
		//двузначные числа
		this.infoTable = function(isDouble){
			if (isDouble) 
			{
				if ( countSlides < 10 ) countSlides = '0'+countSlides;

				$(curr).text('01');

				$(slider).on('afterChange', function(slick, currentSlide) {
					let current = currentSlide.currentSlide+1;
					if ( current < 10 ) current = '0'+current;
					$(curr).text( current );
				});
			}
			else
			{
				$(curr).text(1);

				$(slider).on('afterChange', function(slick, currentSlide) {
					let current = currentSlide.currentSlide+1;
					$(curr).text( current );
				});
			}


			$(count).text( countSlides );
		}


		this.unSlider = function() {
			$(slider).slick('unslick');
		}


		init();
	}


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
		
		$.ajax({
			type: 'post', 
			url:  $(form).attr('action'),
			data: $(form).serialize(),
			success: function(dataJson){
				$(submit).removeAttr('disabled');
				
				dataObj = JSON.parse(dataJson);
				data = dataObj.code;
				console.log(dataObj);
				
				if (data == "100"){
					$(form).find('input[type=text]').val('');
					$(form).find('input[type=tel]').val('');

					if (modalLity) modalLity.close();
					modalLity = lity('#modal-thanks');
					setTimeout(function(){ modalLity.close(); }, 5000);
				};
				if (data == "101"){
					$(form).find('input[type=text]').val('');
					$(form).find('input[type=tel]').val('');
					alert('Сообщение не отправлено<br/>Попробуйте еще раз');
				};
				if (data == "102"){
					$(form).find('input[required]').each(function(i){
						if($(this).val() == '') $(this).addClass('alert');
					});
					alert('Заполните обязательные поля');
				};
				if (data == "103"){
					$(form).find('input[name=phone]').addClass('alert');
					alert('Неправильный номер телефона');
				};
				
			}
		});
	});
});