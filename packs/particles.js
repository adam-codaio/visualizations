const definition = {
  type: 'circle-particles',
  name: 'Circle Particles',
  dataStructureType: 'TimeSeries', // TODO(David): update this type
  fn: (d3, node, data, width, height) => {
    let x1 = width / 2;
    let y1 = height / 2;
    let x0 = x1;
    let y0 = y1;
    let i = 0;
    const r = 200;
    const τ = 2 * Math.PI;

    function move(d) {
      const mouse = d3.pointer(d);
      x1 = mouse[0];
      y1 = mouse[1];
      d.preventDefault();
    }

    const canvas = d3.select(node);
    canvas
      .attr('width', width)
      .attr('height', height)
      .on('ontouchstart' in document ? 'touchmove' : 'mousemove', move);

    const context = canvas.node().getContext('2d');
    context.globalCompositeOperation = 'lighter';
    context.lineWidth = 2;

    d3.timer(() => {
      context.clearRect(0, 0, width, height);

      const z = d3.hsl(++i % 360, 1, 0.5).rgb();
      const c = 'rgba(' + z.r + ',' + z.g + ',' + z.b + ',';
      const x = (x0 += (x1 - x0) * 0.1);
      const y = (y0 += (y1 - y0) * 0.1);

      d3.select({})
        .transition()
        .duration(2000)
        .ease(Math.sqrt)
        .tween('circle', () => {
          return function (t) {
            context.strokeStyle = c + (1 - t) + ')';
            context.beginPath();
            context.arc(x, y, r * t, 0, τ);
            context.stroke();
          };
        });
    });
  },
};
