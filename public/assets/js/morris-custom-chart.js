"use strict";
$(document).ready(function () {
    donutChart();
    barChart();

    fetch('/stats/numbers')
        .then(res => res.json())
        .then(data => {
            document.getElementById('num1').innerText = data.num1
            document.getElementById('num2').innerText = data.num2
        })
});

/*Donut chart*/
function donutChart() {
    fetch('/stats/donut')
        .then(res => res.json())
        .then(data => {
            window.areaChart = Morris.Donut({
                element: 'donut-example',
                redraw: true,
                data,
                colors: ['#5FBEAA', '#34495E', '#FF9F55'],
                resize: true
            });
        })

}

function barChart() {
    fetch('/stats/bar')
        .then(res => res.json())
        .then(data => {
            // Morris bar chart
            Morris.Bar({
                element: 'morris-bar-chart',
                data,
                xkey: 'y',
                ykeys: ['a'],
                labels: ['Number of contributions'],
                barColors: ['#5FBEAA', '#5D9CEC', '#cCcCcC'],
                hideHover: 'auto',
                gridLineColor: '#eef0f2',
                resize: true,
                ymax: 'auto',
                xLabelAngle: 40
            });

            document.querySelector('.morris-hover').style.padding = "10px"
            document.querySelector('.morris-hover').style.minWidth = "200px"
            document.querySelector('#morris-bar-chart').firstElementChild.style.height = "400px"
        })
}