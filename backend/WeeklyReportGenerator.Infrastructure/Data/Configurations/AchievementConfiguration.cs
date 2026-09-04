using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Data.Configurations;

public class AchievementConfiguration : IEntityTypeConfiguration<Achievement>
{
    public void Configure(EntityTypeBuilder<Achievement> builder)
    {
        builder.ToTable("achievements");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.HasOne(a => a.WeeklyReport)
            .WithMany(r => r.Achievements)
            .HasForeignKey(a => a.WeeklyReportId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}