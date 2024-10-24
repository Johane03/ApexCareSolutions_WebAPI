using System.ComponentModel.DataAnnotations.Schema;

namespace aspAPI.models
{
    

    [Table("ServiceRequests")] 
    public class ServiceRequest
    {
        public int ServiceRequestId { get; set; }
        public int ClientId { get; set; }
        public int TechnicianId { get; set; }
        public string IssueDescription { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public DateTime AssignedDate { get; set; }
        public DateTime? ResolutionDate { get; set; } 
    }

}
