import {
    select,
    json,
    tree,
    hierarchy,
    linkHorizontal,
    zoom
}
    from 'd3';

const svg = select('svg');
const width = document.body.clientWidth;
const height = document.body.clientHeight;

const margin = { top: 0, right: 50, bottom: 0, left: 75};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const treeLayout = tree().size([innerHeight, innerWidth]);

const zoomG = svg
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.right})`);

svg.call(zoom().on('zoom', (event) => {
    zoomG.attr('transform', event.transform);
}));

json('./data.json')
    .then(data => {
        const root = hierarchy(data);
        const links = treeLayout(root).links();

        const linkPathGenerator = linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)

        zoomG.selectAll('path').data(links)
            .enter().append('path')
            .attr('class', 'link')
            .attr('d', linkPathGenerator);

        zoomG.selectAll('text').data(root.descendants())
            .enter().append('text')
            .attr('x', d => d.y)
            .attr('y', d => d.x)
            .attr('dy', '0.32em')
            .attr('text-anchor', d => d.children ? 'middle':'start')
            .attr('class','text')
            .attr('font-size', d => 3.2 - d.depth+'em')
            .text(d => d.data.data.id);
    });