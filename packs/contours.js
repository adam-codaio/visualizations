const definition = {
  type: 'Contours',
  name: 'Contours',
  dataStructureType: 'Numeric',
  fn: (d3, node, data, width, height) => {
    const margin = {top: 20, right: 30, bottom: 30, left: 40};

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .nice()
      .rangeRound([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .nice()
      .rangeRound([height - margin.bottom, margin.top]);

    const contours = d3
      .contourDensity()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .size([width, height])
      .bandwidth(30)
      .thresholds(30)(data);

    function xAxis(g) {
      return g
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g_ => g_.select('.domain').remove());
    }

    function yAxis(g) {
      return g
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g_ => g_.select('.domain').remove());
    }

    const svg = d3.select(node);

    svg.attr('viewBox', [0, 0, width, height]);

    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);

    svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .selectAll('path')
      .data(contours)
      .enter()
      .append('path')
      .attr('stroke-width', (d, i) => (i % 5 ? 0.25 : 1))
      .attr('d', d3.geoPath());

    svg
      .append('g')
      .attr('stroke', 'white')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 2);
  }
};