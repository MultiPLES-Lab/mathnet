var options = {
  valueNames: [ 'title', 'press', 'author', 'keyword', 'tag']
};

function createFilteredList(id) {
  return document.getElementById(id) ? new List(id, options) : null;
}

var publicationLists = [
  createFilteredList('filtered-list1'),
  createFilteredList('filtered-list2'),
  createFilteredList('filtered-list3'),
  createFilteredList('filtered-list4'),
  createFilteredList('filtered-list5'),
  createFilteredList('filtered-list6')
].filter(Boolean);

function forEachPublicationList(callback) {
  publicationLists.forEach(callback);
}

function normalizeFilterText(value) {
  return (value || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();
}

// Resolve deep links after layout and skip the site's long smooth scroll,
// which can otherwise traverse many screens of publications on mobile.
function revealLinkedPublication() {
  var id;
  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch (error) {
    return;
  }
  var target = id && document.getElementById(id);
  if (!target || !target.classList.contains('publication-entry')) return;

  window.requestAnimationFrame(function() {
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
    target.focus({ preventScroll: true });
  });
}

window.addEventListener('load', revealLinkedPublication);
window.addEventListener('hashchange', revealLinkedPublication);

document.querySelectorAll('.research-grid').forEach(function(grid) {
  var more = grid.querySelector('.research-grid-more');
  if (!more) return;
  more.hidden = !grid.querySelector('.research-thumbnail[hidden]');

  more.addEventListener('click', function() {
    var expanded = more.getAttribute('aria-expanded') !== 'true';
    grid.classList.toggle('is-expanded', expanded);
    grid.querySelectorAll('.research-thumbnails').forEach(function(topic) {
      var section = topic.closest('.research-topic');
      var expandedOnly = section.hasAttribute('data-expanded-only');
      section.hidden = expandedOnly && !expanded;
      topic.querySelectorAll('.research-thumbnail').forEach(function(thumbnail, index) {
        thumbnail.hidden = !expanded && (expandedOnly || index >= 9);
      });
    });
    more.setAttribute('aria-expanded', String(expanded));
    more.setAttribute('aria-label', expanded ? 'Show fewer research publications' : 'Show all research publications');
    more.textContent = expanded ? 'Show less' : '...';
    grid.querySelector('.research-grid-status').textContent = expanded
      ? 'All ' + grid.querySelectorAll('.research-thumbnail').length + ' papers shown in full-width topic sections.'
      : 'Showing nine publications per topic.';
    // Keep the new layout in view and keyboard navigation at its beginning.
    grid.querySelector('.research-thumbnail').focus({ preventScroll: true });
    grid.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
});

function itemHasFilterValue(item, filterText) {
  var needle = normalizeFilterText(filterText);
  var values = item.values();
  var fields = ['keyword', 'tag'];

  for (var i = 0; i < fields.length; i++) {
    var haystack = normalizeFilterText(values[fields[i]]);
    if (haystack.indexOf(needle) !== -1) {
      return true;
    }
  }

  return false;
}

$('#search-field').on('keyup', function() {
  var searchString = $(this).val();
  forEachPublicationList(function(list) {
    list.filter();
    list.search(searchString);
  });
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
    var buttonText = $(this).text().trim();
    $('#search-field').val(buttonText);
    forEachPublicationList(function(list) {
      list.search('');
      list.filter(function(item) {
        return itemHasFilterValue(item, buttonText);
      });
    });
  });

  $('#search-clear-keywords').click(function(){
    var buttonText = "";
    $('#search-field').val(buttonText).trigger('keyup');
  });

});
