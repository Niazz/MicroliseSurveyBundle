$(function() {
	alert('no css transitions :(');

	$( document ).click(function() {
 $("#js-filters ").animate({
	width: 'toggle'
  }, 1000, function() {
    // Animation complete.
  });
});
});
