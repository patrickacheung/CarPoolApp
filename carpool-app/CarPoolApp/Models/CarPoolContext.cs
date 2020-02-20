using Microsoft.EntityFrameworkCore;

namespace CarPoolApp.Models
{
    public class CarPoolContext : DbContext
    {
        public DbSet<CarPool> CarPools { get; set; }
        public DbSet<WeekDay> WeekDays { get; set; }
        public DbSet<Occurance> Occurances { get; set; }

        public CarPoolContext(DbContextOptions<CarPoolContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CarPool>().ToTable("CarPool");
            modelBuilder.Entity<WeekDay>().ToTable("WeekDay");
            modelBuilder.Entity<Occurance>().ToTable("Occurance");

            modelBuilder.Entity<Occurance>()
                .HasKey(o => new { o.CarPoolID, o.DayID });

            modelBuilder.Entity<Occurance>()
                .HasOne(o => o.CarPool)
                .WithMany(c => c.Occurances)
                .HasForeignKey(o => o.CarPoolID);

            modelBuilder.Entity<Occurance>()
                .HasOne(o => o.WeekDay)
                .WithMany(w => w.Occurances)
                .HasForeignKey(o => o.DayID);
        }
    }
}
