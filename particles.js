// Based on https://bl.ocks.org/mbostock/9539958
const definition = {
  type: 'circle-particles',
  name: 'Circle Particles',
  dataStructureType: 'TimeSeries', // TODO(David): update this type
  fn: (d3, node, data, width, height) => {
    var x1 = width / 2,
        y1 = height / 2,
        x0 = x1,
        y0 = y1,
        i = 0,
        r = 200,
        τ = 2 * Math.PI;

    function move() {
      var mouse = d3.mouse(this);
      x1 = mouse[0];
      y1 = mouse[1];
      d3.event.preventDefault();
    }

    var context = node.getContext("2d");
    context.globalCompositeOperation = "lighter";
    context.lineWidth = 2;

    d3.timer(function() {
      context.clearRect(0, 0, width, height);

      var z = d3.hsl(++i % 360, 1, .5).rgb(),
          c = "rgba(" + z.r + "," + z.g + "," + z.b + ",",
          x = x0 += (x1 - x0) * .1,
          y = y0 += (y1 - y0) * .1;

      d3.select({}).transition()
          .duration(2000)
          .ease(Math.sqrt)
          .tween("circle", function() {
            return function(t) {
              context.strokeStyle = c + (1 - t) + ")";
              context.beginPath();
              context.arc(x, y, r * t, 0, τ);
              context.stroke();
            };
          });
    });

    // node.on("ontouchstart" in document ? "touchmove" : "mousemove", move);
  },
};
