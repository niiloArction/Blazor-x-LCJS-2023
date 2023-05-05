using Microsoft.AspNetCore.Mvc;

namespace Blazor_x_LCJS_2023.Controllers
{
    [ApiController]
    [Route("api/data")]
    public class DataController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetData()
        {
            // Generate some random data
            Random random = new Random();
            float[] data = new float[1000];
            float prevY = 0;
            for (int i = 0; i < data.Length; i++)
            {
                float y = prevY + (random.NextSingle() * 2 - 1);
                data[i] = y;
                prevY = y;
            }
            return Ok(data);
        }
    }
}