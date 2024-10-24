 using aspAPI.data;
using aspAPI.models;
using aspAPI.services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace aspAPI.Controllers
{
    


    [Route("api/[controller]")]
        [ApiController]
        public class ServiceRequestController : ControllerBase
        {
            private readonly DataContext _context;
            private readonly SmsService _smsService;

        public ServiceRequestController(DataContext context, SmsService smsService)
            {
                _context = context;
                _smsService = smsService;
            }


            [HttpGet]
            public async Task<ActionResult<IEnumerable<ServiceRequest>>> GetServiceRequests()
            {
                var serviceRequests = await _context.ServiceRequests
                    .Select(sr => new
                    {
                        sr.ServiceRequestId,
                        sr.ClientId,              
                        sr.IssueDescription,
                        sr.Status,
                        sr.Priority
                    })
                    .ToListAsync();

                return Ok(serviceRequests);
            }



            [HttpGet("{id}")]
            public async Task<ActionResult<ServiceRequest>> GetServiceRequest(int id)
            {
                var serviceRequest = await _context.ServiceRequests.FindAsync(id);

                if (serviceRequest == null)
                {
                    return NotFound();
                }

                return serviceRequest;
            }

          
            [HttpPut("{id}")]
            public async Task<IActionResult> PutServiceRequest(int id, ServiceRequest serviceRequest)
            {
                if (id != serviceRequest.ServiceRequestId)
                {
                    return BadRequest();
                }

                _context.Entry(serviceRequest).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ServiceRequestExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }

           
            [HttpPost]
            public async Task<ActionResult<ServiceRequest>> PostServiceRequest(ServiceRequest serviceRequest)
            {
                _context.ServiceRequests.Add(serviceRequest);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetServiceRequest", new { id = serviceRequest.ServiceRequestId }, serviceRequest);
            }

           
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteServiceRequest(int id)
            {
                var serviceRequest = await _context.ServiceRequests.FindAsync(id);
                if (serviceRequest == null)
                {
                    return NotFound();
                }

                _context.ServiceRequests.Remove(serviceRequest);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            private bool ServiceRequestExists(int id)
            {
                return _context.ServiceRequests.Any(e => e.ServiceRequestId == id);
            }

        [HttpPost("send-sms")]
        public async Task<IActionResult> SendSms([FromQuery] string phoneNumber, [FromQuery] string message)
        {
            if (string.IsNullOrEmpty(phoneNumber) || string.IsNullOrEmpty(message))
            {
                return BadRequest(new { Error = "Phone number and message are required." });
            }

            try
            {
                
                await _smsService.SendSmsAsync(phoneNumber, message);
                return Ok(new { Message = "SMS sent successfully!" });
            }
            catch (System.Exception ex)
            {
                
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
    

}
