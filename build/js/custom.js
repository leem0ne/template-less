
//MATCH MEDIA POINTS
function isMatchMediaArr(arr) {
  if ( !Array.isArray(arr) ) return [];
  var res = {};
  arr.forEach(function(el, i) {
    res[el] =  window.matchMedia('(min-width:'+parseInt(el, 10)+'px)').matches;
  });
  return res;
} 
var matchMediaArr = isMatchMediaArr([430, 560, 780, 990, 1250]);
console.log(matchMediaArr);


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
	var lazyLoadInstance = new LazyLoad({
	    elements_selector: ".lazy"
	});


	//scroll menu
	$('.nav__link').click( function(){
		var scroll_el = $(this).attr('href');
		if ($(scroll_el).length != 0) {
			$('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 800);
		}
		if ( $('.toggle').is(':visible') )
			$('#top-menu').css('display', '');
		return false;
	});

	$('.toggle').on('click', function() {
		if ( $('#top-menu').is(':visible') ) {
			$('#top-menu').css('display', '');
		} else {
			$('#top-menu').css('display', 'block');
		}
	});

	//magnificPopup
	$('.phone__btn').magnificPopup({
		type: 'inline',
		closeBtnInside: true,
		callbacks: {
    open: function() {
    	$('body').addClass('modal-open');
    },
    close: function() {
    	$('body').removeClass('modal-open');
    }
  }
	}).on('click', function(){
		var title = $(this).data('title') ? $(this).data('title') : $(this).text();
		$('#modal-call').find('.form__desc').text( title );
		$('#modal-call').find('input[name=title]').val( title );
	});

	//slider slick
	var sliderWrap = $('#slider'),
			slider = $(sliderWrap).find('.slider');

	$(sliderWrap).find('.slider__curr').text(1);
	$(sliderWrap).find('.slider__count').text( $(slider).find('.slider__slide').length );

	$(slider).on('afterChange', function(slick, currentSlide) {
		$(sliderWrap).find('.slider__curr').text( currentSlide.currentSlide + 1 );
	});

	$(slider).slick({
	    prevArrow: '#arrows-prev',
	    nextArrow: '#arrows-next',
	    centerMode: true,
	    centerPadding: '0',
	    slidesToShow: 3,
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
					$.magnificPopup.close();
					$.magnificPopup.open({
						items: {
						    src: '#modal-thanks',
						},
						type: 'inline',
				    closeBtnInside: true,
				    showCloseBtn: true,
						callbacks: {
					    open: function() {
					    	$('body').addClass('modal-open');
					    },
					    close: function() {
					    	$('body').removeClass('modal-open');
					    }
					  }
					});
					setTimeout(function(){ $.magnificPopup.close(); }, 5000);
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