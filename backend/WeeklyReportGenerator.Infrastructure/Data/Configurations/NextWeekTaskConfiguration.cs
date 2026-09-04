using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Data.Configurations;

public class NextWeekTaskConfiguration : IEntityTypeConfiguration<NextWeekTask>
{
    public void Configure(EntityTypeBuilder<NextWeekTask> builder)
    {
        builder.ToTable("next_week_tasks");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.TaskName)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(t => t.Description)
            .HasMaxLength(1000);

        builder.HasOne(t => t.WeeklyReport)
            .WithMany(r => r.NextWeekTasks)
            .HasForeignKey(t => t.WeeklyReportId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}