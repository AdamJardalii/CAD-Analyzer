using Microsoft.EntityFrameworkCore;
using CadabraTest.API.Models;

namespace CadabraTest.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) 
            : base(options)
        {
            // Constructor should be empty or contain logic, but not DbSet declarations
        }

        // Declare DbSet properties here, at class level
        public DbSet<ApplicationUser> Users { get; set; } = null!;
        public DbSet<AnalysisResponse> Analyses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Owned type configuration
            modelBuilder.Entity<AnalysisResponse>()
                .OwnsOne(a => a.PartMetadata, pm =>
                {
                    pm.OwnsOne(p => p.Dimensions);
                });
            modelBuilder.Entity<ApplicationUser>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Optional: AIAnalysis can be another owned type, if you don't want a separate table
            modelBuilder.Entity<AnalysisResponse>()
                .OwnsOne(a => a.AIAnalysis);
        }
    


    }
}
