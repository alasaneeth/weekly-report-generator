using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Data.Configurations;

public class WeeklyReportConfiguration : IEntityTypeConfiguration<WeeklyReport>
{
    public void Configure(EntityTypeBuilder<WeeklyReport> builder)
    {
        builder.ToTable("weekly_reports");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(r => r.ManagerComment)
            .HasMaxLength(2000);

        builder.Property(r => r.Notes)
            .HasMaxLength(2000);

        builder.Property(r => r.Links)
            .HasMaxLength(1000);

        // One report per user per week
        builder.HasIndex(r => new { r.UserId, r.WeekStartDate }).IsUnique();

        builder.HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Project)
            .WithMany()
            .HasForeignKey(r => r.ProjectId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasQueryFilter(r => !r.IsDeleted);
    }
}