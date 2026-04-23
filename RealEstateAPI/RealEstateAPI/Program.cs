using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using RealEstateAPI.Data;
using RealEstateAPI.Hubs;
using RealEstateAPI.Models;
using RealEstateAPI.Services;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Read connection string once
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// =======================
// ✅ SERVICES
// =======================

// 🔹 Database (MySQL)
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseMySql(
    connectionString,
    ServerVersion.AutoDetect(connectionString)
));
}
else
{
    Console.WriteLine("⚠️ No DB connection string found");
}

// 🔹 Custom Services
builder.Services.AddScoped<RentPaymentService>();
builder.Services.AddScoped<CloudinaryService>();

// 🔹 Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

// 🔹 SignalR
builder.Services.AddSignalR();

// 🔹 Identity
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();
}

// 🔹 JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var key = builder.Configuration["Jwt:Key"] ?? "default_secret_key_12345";

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
    };
});

// 🔹 Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 CORS (IMPORTANT for React + Railway)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});
// 🔹 Cloudinary config
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));


// =======================
// ✅ BUILD APP
// =======================

var app = builder.Build();


// =======================
// ✅ MIDDLEWARE
// =======================

app.UseCors("AllowFrontend");

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();


// =======================
// ✅ ROUTES
// =======================

app.MapControllers();
app.MapHub<ChatHub>("/chatHub").RequireCors("AllowFrontend");


// =======================
// ✅ OPTIONAL ROLE SEED
// =======================

if (!string.IsNullOrEmpty(connectionString))
{
    using var scope = app.Services.CreateScope();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    
    string[] roles = { "Admin", "User" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
       {
          await roleManager.CreateAsync(new IdentityRole(role));
       }
    }
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // 🔥 creates tables in Railway DB
}
// =======================
// ✅ PORT FIX (RAILWAY)
// =======================

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");