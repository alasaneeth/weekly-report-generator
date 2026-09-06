using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Data.Configurations;

public class BlockerConfiguration : IEntityTypeConfiguration<Blocker>
{
    public void Configure(EntityTypeBuilder<Blocker> builder)
    {
        builder.ToTable("blockers");
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.HasOne(b => b.WeeklyReport)
            .WithMany(r => r.Blockers)
            .HasForeignKey(b => b.WeeklyReportId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}