# Using LightningChart JS in Blazor for data visualization

This repository was initialized by following Microsofts tutorial for [getting started with Blazor](https://dotnet.microsoft.com/en-us/learn/aspnet/blazor-tutorial/install).

- Visual Studio 2022
- ASP .NET and web development workload required
- Using "Blazor server app template"
- .NET 7.0

From there, the minimal steps were taken to put LightningChart JS inside the application, and show a couple of ways to use it.
These code changes can be found isolated from the [Git commit history](https://github.com/niiloArction/Blazor-x-LCJS-2023/commits/master).

<img width="962" alt="image" src="https://user-images.githubusercontent.com/55391673/236818054-57ac5573-ad0f-440b-a71b-ebacb0310716.png">

## Add LightningChart JS as a JavaScript library dependency.

- Download `lcjs.iife.js` from a CDN service such as [jsdelivr](https://www.jsdelivr.com/package/npm/@arction/lcjs) and place the file in `wwwroot/js/`
- Register it as a global dependency in `Pages/_Host.cshtml`

## Add JavaScript to the project to work with LightningChart JS

Found in `wwwroot/js/chart.js`. It is also registered in `Pages/_Host.cshtml`.
This is a completely custom script that works together with the C# client application and communicates with LightningChart JS.

## Finally, use the custom JS script from a Razor component

- Render a `DIV` element that will house the LightningChart component

`<div id="chart"></div>`

- After component render, tell the JS script to display the chart in the DIV

```
@code {
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }
        await JS.InvokeVoidAsync("createChart", "chart");
    }
}
```

- Control the DIV layout using normal Razor methods. For example, by adding CSS in `wwwroot/css/site.css`

```css
#chart {
    width: 100%;
    height: 400px;
}
```

This should display an empty chart on the user interface.
Next, data should be transferred to the charts using one of many possible methods.

## Data transfer using invoke JavaScript

Serialize data into a JSON string and invoke a JS side function with the string as its parameter to send data to the JS script and from there to LightningChart.
This is simple, robust, and fast enough for most use cases.

```
@using System.Text.Json;
List<Point> data = new List<Point>();
string json = JsonSerializer.Serialize(data);
await JS.InvokeVoidAsync("setChartData", "chart", json);
```

## Data transfer using SignalR

Much better method for real-time data visualization, setup a SignalR client in the JS script and stream data points into LightningChart with low latency.

- Add [SignalR and SignalR JavaScript client](https://learn.microsoft.com/en-us/aspnet/core/tutorials/signalr?view=aspnetcore-7.0&tabs=visual-studio) as project dependencies
- Also register the JS client library in `Pages/_Host.cshtml`
- Add SignalR Hub `Hubs/ChartDataTransferHub.cs` 
- Add the SignalR service and register the Hub in `Program.cs`
- Afterwards, you can communicate between C# client, backend as well as the JS chart script in real-time.

This project shows how to send random data from the C# client to JS script - see files `Pages/Index.razor`, `wwwroot/js/chart.js` and `Hubs/ChartDataTransferHub.cs`.
It should also be possible to send data directly from backend to the JS script.

## Data transfer using REST API end point

- Create an API end point on Blazor server with `Controllers/DataController.cs`
- Register the controller and endpoint in `Program.cs`
- Fetch the data by initiating a request in the JS script.

```js
fetch('/api/data')
    .then(r => r.json())
    .then(data => {
        lineSeriesAPI.addArrayY(data)
    })
```

