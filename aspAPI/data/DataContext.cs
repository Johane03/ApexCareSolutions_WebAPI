using Microsoft.EntityFrameworkCore;
using aspAPI.models;

namespace aspAPI.data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        
        public DbSet<Client> Customers { get; set; }

        public DbSet<Client> Clients { get; set; }

       

        public DbSet<ServiceRequest> ServiceRequests { get; set; }



    }
}
