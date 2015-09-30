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

  var template,
      graph,
      isFirst = true,
      $graphContainer = $('.graph');

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

  function getGraph(state, result = {}) {
    var data = story[state];
    if (!(state in result)) {
      result[state] = [];
      var cur_choices = data['choices'],
          c;
      for (var i = 0; i < cur_choices.length; i++) {
        c = cur_choices[i];
        result[state].push(c);
        result = $.extend(result, getGraph(c, result));
      }
    }
    return result;
  }

  function addNode(g, id, name) {
    if (name === undefined) {
      name = id;
    }
    if (g.getElementById(id).length === 0) {
      g.add({group: 'nodes', data: { id: id, name: name }});
    }
  }

  function initGraph() {
    var storyGraph = getGraph('start');
    $graphContainer.cytoscape({
      layout: {
        name: 'circle',
        padding: 10
      },
      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          'content': 'data(name)',
          'text-valign': 'center',
          'color': 'white',
          'text-outline-width': 2,
          'text-outline-color': '#888'
        })
      .selector('edge')
        .css({
          'target-arrow-shape': 'triangle'
        })
      .selector(':selected')
        .css({
          'background-color': 'black',
          'line-color': 'black',
          'target-arrow-color': 'black',
          'source-arrow-color': 'black'
        })
      .selector('.faded')
        .css({
          'opacity': 0.25,
          'text-opacity': 0
        }),
    });
    graph = $graphContainer.cytoscape('get');
    for (var l in storyGraph) {
        addNode(graph, l);
      var currEdges = storyGraph[l];
      for (var i = 0; i < currEdges.length; i++) {
        var nodeLabel = currEdges[i];
        addNode(graph, nodeLabel);
        graph.add({group: 'edges', data: { source: l, target: nodeLabel }});
      }
    }
    return graph;
  }

  $(window).load(function () {
    var startState = getStatusFromUrl(window.location);
    template = $('#template').html();
    loadState(startState ? startState : 'start');
    initGraph();
  });

  $(document).on('click', '.scene .choices li a', function (o) {
    loadState(getStatusFromUrl(this));
  }).keypress(function (e) {
    if (e.key === 'm') {
      $graphContainer.toggle();
      if (isFirst) {
        graph.layout();
        graph.resize();
        isFirst = false;
      }
      graph.fit();
    }
  });

})()
