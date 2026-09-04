using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Data.Configurations;

public class ReportTaskConfiguration : IEntityTypeConfiguration<ReportTask>
{
    public void Configure(EntityTypeBuilder<ReportTask> builder)
    {
        builder.ToTable("report_tasks");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.TaskName)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(t => t.Priority)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(t => t.Status)
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(t => t.Deliverable)
            .HasMaxLength(500);

        builder.Property(t => t.TimePlannedHours).HasPrecision(6, 2);
        builder.Property(t => t.TimeSpentHours).HasPrecision(6, 2);

        builder.HasOne(t => t.WeeklyReport)
            .WithMany(r => r.Tasks)
            .HasForeignKey(t => t.WeeklyReportId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}