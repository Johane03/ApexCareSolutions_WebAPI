using aspAPI.data;
using aspAPI.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace aspAPI.Controllers
{
   

   
        [Route("api/[controller]")]
        [ApiController]
        public class ClientsController : ControllerBase
        {
            private readonly DataContext _context;

            public ClientsController(DataContext context)
            {
                _context = context;
            }

            [HttpGet]
            public async Task<ActionResult<IEnumerable<Client>>> GetClients()
            {
                return await _context.Clients.ToListAsync();
            }


            [HttpGet("{clientId}")]
            public async Task<ActionResult<Client>> GetClientById(int clientId)
            {
                var client = await _context.Clients.FindAsync(clientId);

                if (client == null)
                {
                    return NotFound();
                }

                return client;
            }
        }
    

}
