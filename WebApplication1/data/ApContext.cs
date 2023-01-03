using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Models;

public class ApContext : DbContext
{
    public ApContext(DbContextOptions dbContextOptions)
        : base(dbContextOptions)
    {
    }

    public DbSet<LoginModel>? LoginModels { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LoginModel>().HasData(new LoginModel
        {
            Id = 1,
            UserName = "test",
            Password = "test"
        });
    }
}