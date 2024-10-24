using System.ComponentModel.DataAnnotations.Schema;

namespace aspAPI.models
{
    [Table("Clients")]
    public class Client
    {
        public int ClientId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }


}
