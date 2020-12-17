function bollinger(values, N, K) {
  let i = 0;
  let sum = 0;
  let sum2 = 0;
  const bands = K.map(() => new Float64Array(values.length).fill(NaN));
  for (let n = Math.min(N - 1, values.length); i < n; ++i) {
    const value = values[i];
    sum += value;
    sum2 += value ** 2;
  }
  for (let n = values.length; i < n; ++i) {
    const value = values[i];
    sum += value;
    sum2 += value ** 2;
    const mean = sum / N;
    const deviation = Math.sqrt((sum2 - sum ** 2 / N) / (N - 1));
    for (let j = 0; j < K.length; ++j) {
      bands[j][i] = mean + deviation * K[j];
    }
    const value0 = values[i - N + 1];
    sum -= value0;
    sum2 -= value0 ** 2;
  }
  return bands;
}

const definition = {
  type: 'BollingerBands',
  name: 'Bollinger Bands',
  dataStructureType: 'TimeSeries',
  fn: (d3, node, data, width, height) => {
    const margin = {top: 10, right: 20, bottom: 30, left: 40};
    const hardCodedN = 20;
    const hardCodedK = 2;

    const values = Float64Array.from(data, d => d.value);

    const xValues = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.date))
      .rangeRound([margin.left, width - margin.right]);

    const yValues = d3
      .scaleLog()
      .domain(d3.extent(values))
      .rangeRound([height - margin.bottom - 20, margin.top]);

    const line = d3
      .line()
      .defined(d => !isNaN(d))
      .x((d, i) => xValues(data[i].date))
      .y(yValues);

    function xAxis(g) {
      return g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xValues).ticks(width / 80))
        .call(g_ => g_.select('.domain').remove());
    }

    function yAxis(g) {
      return g
        .attr('transform', `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(yValues)
            .tickValues(d3.ticks(...yValues.domain(), 10))
            .tickFormat(d => d),
        )
        .call(g_ => g_.select('.domain').remove())
        .call(g_ =>
          g_
            .selectAll('.tick line')
            .clone()
            .attr('x2', width - margin.left - margin.right)
            .attr('stroke-opacity', 0.1),
        )
        .call(g_ =>
          g_
            .select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text('$ Close'),
        ); // TODO (Adam) do something here.
    }

    const svg = d3.select(node);

    svg.attr('viewBox', [0, 0, width, height]).style('overflow', 'visible');

    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);

    svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data([values, ...bollinger(values, hardCodedN, [-hardCodedK, 0, +hardCodedK])])
      .join('path')
      .attr('stroke', (d, i) => ['#aaa', 'green', 'blue', 'red'][i])
      .attr('d', line);
  }
};
