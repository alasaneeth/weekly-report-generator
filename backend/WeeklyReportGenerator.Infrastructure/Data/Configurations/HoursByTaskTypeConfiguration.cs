using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Data.Configurations;

public class HoursByTaskTypeConfiguration : IEntityTypeConfiguration<HoursByTaskType>
{
    public void Configure(EntityTypeBuilder<HoursByTaskType> builder)
    {
        builder.ToTable("hours_by_task_type");
        builder.HasKey(h => h.Id);

        builder.Property(h => h.TaskType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(h => h.Hours).HasPrecision(6, 2);

        builder.HasOne(h => h.WeeklyReport)
            .WithMany(r => r.HoursByTaskTypes)
            .HasForeignKey(h => h.WeeklyReportId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}