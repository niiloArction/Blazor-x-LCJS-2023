using Microsoft.AspNetCore.SignalR;

namespace Blazor_x_LCJS_2023.Hubs
{
    public class ChartDataTransferHub : Hub
    {
        public async Task SendData(string containerId, float[] data)
        {
            await Clients.All.SendAsync("ReceiveData", containerId, data);
        }
    }
}
