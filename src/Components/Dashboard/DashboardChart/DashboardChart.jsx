import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

// the following component uses ChartJS library to create a Chart(Line Chart)
// links to chart JS: https://www.chartjs.org/docs/latest/ and https://react-chartjs-2.js.org/
// https://www.youtube.com/watch?v=RF57yDglDfE


//ChartJS options object to hide grid lines and style the charts x and y axes labels
let gridLines = {
    scales: {
        x: {
            grid: { display: false },
            ticks: {color: '#fff'}
        },

        y: {
            grid: { display: false},
            ticks: {color: '#fff', fontWeight: 'bold'}
        },  
    },
}

function DashboardChart({ monthlyChart }) {
    //setting the chart data and datasets of a specific coin
    let chartData = {
        labels: monthlyChart === null ? '' : monthlyChart.map((data)=> data.date),
        datasets: [{
        label: 'Prices: ZAR',
        data: monthlyChart === null ? '' : monthlyChart.map((data)=> data.price),
        borderColor: ['white'],
        segment: {backgroundColor: '#ffffff45'},
        fill: true
      }]
    }

    return (
        <>
            <Line data={chartData} options={gridLines} />
        </>
    )
}

export default DashboardChart