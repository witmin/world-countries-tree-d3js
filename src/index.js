import {
    select,
    json,
    tree,
    hierarchy,
    linkHorizontal}
    from 'd3';


const width = document.body.clientWidth;
const height = document.body.clientHeight;

const svg = select('svg');

const treeLayout = tree()
    .size([height, width])

svg
    .attr('width', width)
    .attr('height', height)
    .append('rect');

json('./data.json')
    .then(data => {
        const root = hierarchy(data);
        const links = treeLayout(root).links();

        const linkPathGenerator = linkHorizontal()
            .x( d => d.y)
            .y( d => d.x)

        svg.selectAll('path').data(links)
            .enter().append('path')
            .attr('d', linkPathGenerator)
    });