using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Infrastructure.Data;
using WeeklyReportGenerator.Infrastructure.Services;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Remove default Windows EventLog provider — avoids broken EventLog/RPC issues on some dev machines
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT access token"
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});

// EF Core + PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI — Repositories, UnitOfWork, Services
builder.Services.AddScoped<IUnitOfWork, WeeklyReportGenerator.Infrastructure.Repositories.UnitOfWork>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IWeeklyReportService, WeeklyReportGenerator.Infrastructure.Services.WeeklyReportService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// JWT Authentication
var jwtSecretKey = builder.Configuration["JwtSettings:SecretKey"]!;
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();