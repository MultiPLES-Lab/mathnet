var options = {
  valueNames: [ 'title', 'press', 'author', 'keyword', 'tag']
};
var userList1 = new List('filtered-list1', options);
var userList2 = new List('filtered-list2', options);
var userList3 = new List('filtered-list3', options);
var userList4 = new List('filtered-list4', options);
var userList5 = new List('filtered-list5', options);
var userList6 = new List('filtered-list6', options);

$('#search-field').on('keyup', function() {
  var searchString = $(this).val();
  userList1.search(searchString);
  userList2.search(searchString);
  userList3.search(searchString);
  userList4.search(searchString);
  userList5.search(searchString);
  userList6.search(searchString);
});


$(document).ready(function(){

  $('.autoplay-news').slick({
    dots: true,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
    {
      breakpoint: 768,
      settings: {
      slidesToShow: 1,
      centerMode: false, /* set centerMode to false to show complete slide instead of 3 */
      slidesToScroll: 1
      }
    }
  ]
  });

  $('.slider-for').slick({
	slidesToShow: 1,
	slidesToScroll: 1,
	arrows: false,
	fade: true,
	asNavFor: '.slider-nav',
	autoplay: true,
	autoplaySpeed: 3000,
  });

  $('.slider-nav').slick({
	slidesToShow: 9,
	slidesToScroll: 1,
	asNavFor: '.slider-for',
	dots: true,
	centerMode: true,
	focusOnSelect: true,
	responsive: [
	{
		breakpoint: 768,
		settings: {
		slidesToShow: 1,
		centerMode: false, /* set centerMode to false to show complete slide instead of 3 */
		slidesToScroll: 1
		}
	}]
  });

  // demo page: change preview to video
  $('div.video img').click(function(){
    var video = '<iframe src="'
    + $(this).attr('data-video') 
    + '" allow="autoplay" width="'
    + $(this).attr('width')
    + '" height="'
    + $(this).attr('height')
    + '" style="'
    + $(this).attr('style') 
    +'"></iframe>';
    // $('.video').hide();
    $(this).replaceWith(video);
    $('.iframe-overlay').click(function() {
      // Perform action when iframe is 'clicked'
    }).trigger('click');
  });

  $('.search-keywords').click(function(){
    var buttonText = '"' + $(this).text().trim() + '"';
    $('#search-field').val(buttonText).trigger('keyup');
  });

  $('#search-clear-keywords').click(function(){
    var buttonText = "";
    $('#search-field').val(buttonText).trigger('keyup');
  });

});