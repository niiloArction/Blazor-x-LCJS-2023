// JavaScript interface that is called from .NET to interact with JavaScript based LightningChart

const instances = []

/**
 * containerId = id of DOM <div> that will house the chart.
 * The <div> is intented to be created using Razor.
 **/
window.createChart = (containerId) => {
    console.log('createChart', containerId)
    const container = document.getElementById(containerId)
    if (!container) {
        console.error(`wwwroot/js/chart.js createChart container not found in DOM: "${containerId}"`)
        return
    }
    const { lightningChart, Themes } = lcjs
    const chart = lightningChart().ChartXY({ container, theme: Themes.light })
    const lineSeriesInvokeJS = chart.addLineSeries({ dataPattern: { pattern: 'ProgressiveX' } }).setName("Invoke JS")
    const lineSeriesSignalR = chart.addLineSeries({ dataPattern: { pattern: 'ProgressiveX' } }).setName("SignalR")
    const lineSeriesAPI = chart.addLineSeries({ dataPattern: { pattern: 'ProgressiveX' } }).setName("REST API")
    const legend = chart.addLegendBox().add(chart)
    instances.push({ containerId, chart, lineSeriesInvokeJS, lineSeriesSignalR, lineSeriesAPI })

    // Data transfer (.NET -> JS), example #3: Fetch data from server end point.
    fetch('/api/data')
        .then(r => r.json())
        .then(data => {
            console.log('/api/data', data)
            // data expected to be number[]
            lineSeriesAPI.addArrayY(data)
        })
        .catch(error => {
            console.error(`wwwroot/js/chart.js /api/data unexpected error`)
        })
}


// Data transfer (.NET -> JS), example #1: Invoke JS with stringified JSON.
window.setChartData = (containerId, data) => {
    console.log('setChartData', containerId, data)
    const instance = instances.find(item => item.containerId === containerId)
    if (!instance) {
        console.error(`wwwroot/js/chart.js setChartData instance not found: "${containerId}"`)
        return
    }
    const { lineSeriesInvokeJS } = instance
    // data expected to be stringified { x: number, y: number }[]
    const dataParsed = JSON.parse(data)
    lineSeriesInvokeJS.clear().add(dataParsed)
}


// Data transfer (.NET -> JS), example #2: Send binary payload using SignalR.
var connection = new signalR.HubConnectionBuilder().withUrl("/chartDataTransferHub").build();
connection.on("ReceiveData", function (containerId, data) {
    console.log('ReceiveData', containerId, data)
    const instance = instances.find(item => item.containerId === containerId)
    if (!instance) {
        console.error(`wwwroot/js/chart.js ReceiveData instance not found: "${containerId}"`)
        return
    }
    const { lineSeriesSignalR } = instance
    // data expected to be number[]
    lineSeriesSignalR.addArrayY(data)
})
connection.start()


