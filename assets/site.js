$(document).ready(function () {
  applyNavigation();
  applyResize();
  enableTooltipEverywhere();
  attachTagFilterEvent();
  setActiveTopic();
});

function applyNavigation() {
  applyClickEvent();
  applyStickyNavigation();
}

function applyClickEvent() {
  $('a[href^="#"]').on('click.resume', function (e) {
    e.preventDefault();

    if ($($.attr(this, 'href')).length > 0) {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
      }, 400);
    }

    // Autoclose for mobile
    $('.navbar-collapse').removeClass('show').addClass('collapse');

    return false;
  });
}

function applyStickyNavigation() {
  const $window = $(window);
  $window.off('scroll.resume')
  $window.on('scroll.resume', function () {
    stickyNavigation();
    setActiveTopic();
  });

  stickyNavigation();
}

function setActiveTopic() {
  const $navAchors = $('.navbar a[href^="#"]');
  for (let i = $navAchors.length - 1; i >= 0; i--) {
    const $achor = $($navAchors[i])
    const $topic = $(`[id="${$achor.attr('href').replace('#', '')}"]`);
    const $li = $achor.closest('li');
    if (isElementInView($topic)) {
      if (!$li.hasClass('active')) {
        $li.addClass('active');
        const hash = $('.nav .active a').last()?.attr('href');
        history.replaceState(undefined, undefined, hash);
      }
    } else {
      $li.removeClass('active');
    }
  };

}

function stickyNavigation() {
  const lnStickyNavigation = $('.scroll-down').offset().top + $('.scroll-down').height();
  // sorry, but I like golfing
  $('body')[$(window).scrollTop() > lnStickyNavigation ? 'addClass' : 'removeClass']('fixed');
}

function isElementInView(element, fullyInView) {
  var pageTop = $(window).scrollTop();
  var pageBottom = pageTop + $(window).height();
  var elementTop = $(element).offset().top;
  var elementBottom = elementTop + $(element).height();

  if (fullyInView === true) {
    return ((pageTop < elementTop) && (pageBottom > elementBottom));
  } else {
    return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
  }
}

function applyResize() {
  const $window = $(window);
  $window.off('resize.resume');
  $window.on('resize.resume', function () {
    stickyNavigation();
    setActiveTopic();
  });
}

function enableTooltipEverywhere() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
}

function attachTagFilterEvent() {
  const $container = $('#abilities');
  $container.off('change.resume');
  $container.on('change.resume', '.tag input', function () {
    const selectedTags = $(this).closest('.tags').find('.tag input:checked + span').map((_i, x) => $(x).text()).toArray();
    const $els = $container.find('li');
    selectedTags?.length ?
      $els.each((_i, el) => selectedTags.some(x => console.log($(el)) || $(el).data('bs-original-title').includes(x)) ? $(el).removeClass('hidden') : $(el).addClass('hidden')) :
      $els.removeClass('hidden');
  });
}