(function () {
  "use strict";

  var story = {
    'start': {
      title: 'Start',
      text: 'Dolor obcaecati repellendus modi suscipit delectus quam alias? Aperiam ' +
            'quisquam molestias magnam beatae asperiores. Vitae at ipsa labore magni ' +
            'nesciunt reiciendis, itaque. Explicabo maiores repellendus laboriosam ' +
            'consectetur voluptate. Ducimus distinctio?',
      image: 'slide1.jpg',
      choices: [
        'scene_a',
        'scene_b'
      ]
    },
    'scene_a': {
      title: 'Scene a',
      text: 'Dolor obcaecati repellendus modi suscipit delectus quam alias? Aperiam ' +
            'quisquam molestias magnam beatae asperiores. Vitae at ipsa labore magni ' +
            'nesciunt reiciendis, itaque. Explicabo maiores repellendus laboriosam ' +
            'consectetur voluptate. Ducimus distinctio?',
      image: 'slide2.jpg',
      choices: [
        'start',
        'scene_b'
      ]
    },

    'scene_b': {
      title: 'Scene b',
      text: 'Dolor obcaecati repellendus modi suscipit delectus quam alias? Aperiam ' +
            'quisquam molestias magnam beatae asperiores. Vitae at ipsa labore magni ' +
            'nesciunt reiciendis, itaque. Explicabo maiores repellendus laboriosam ' +
            'consectetur voluptate. Ducimus distinctio?',
      image: 'slide3.jpg',
      choices: [
        'scene_a',
        'start'
      ]
    },
  };

  var template;
  Mustache.parse(template);

  function getStatusFromUrl(url) {
    return url.hash.substr(1);
  }

  function loadState(name) {
    var data       = $.extend(story[name], { name: name }),
        $container = $('.container'),
        rendered   = Mustache.render(template, data);
    $container.html(rendered);
  }

  $(window).load(function () {
    template = $('#template').html();
    var startState = getStatusFromUrl(window.location);
    loadState(startState ? startState : 'start');
  });

  $(document).on('click', '.scene .choices li a', function (o) {
    loadState(getStatusFromUrl(this));
  });

})()
