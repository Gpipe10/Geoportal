using Microsoft.AspNetCore.Http.Features;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.Configure<FormOptions>(x =>
{
	x.ValueCountLimit = int.MaxValue;
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
	serverOptions.Limits.MaxRequestBodySize = long.MaxValue;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Home/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
	FileProvider = new PhysicalFileProvider(
		Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
	RequestPath = "",
	OnPrepareResponse = ctx =>
	{
		const int cacheDurationInSeconds = 60 * 60 * 24; // 1 day
		ctx.Context.Response.Headers[HeaderNames.CacheControl] = $"public,max-age={cacheDurationInSeconds}";
	},
    ContentTypeProvider = new FileExtensionContentTypeProvider(new Dictionary<string, string>
    {
        { ".kml", "application/vnd.google-earth.kml+xml" },
         { ".czml", "application/vnd.google-earth.czml" },
        { ".js", "application/javascript" },
        { ".png", "image/png" },
		{ ".jpeg", "image/jpeg" },
		{ ".jpg", "image/jpeg" },
        { ".gif", "image/gif" },
        { ".bmp", "image/bmp" },
        { ".ico", "image/x-icon" },
        { ".svg", "image/svg+xml" },
        { ".webp", "image/webp" },
        { ".tif", "image/tiff" },
        { ".tiff", "image/tiff" },
        { ".kmz", "application/vnd.google-earth.kmz" },
        { ".json", "application/json" },
        { ".xml", "application/xml" },
        { ".pdf", "application/pdf" },
        { ".doc", "application/msword" },
        { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { ".xls", "application/vnd.ms-excel" },
        { ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { ".ppt", "application/vnd.ms-powerpoint" },
        { ".pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
        { ".zip", "application/zip" },
        { ".rar", "application/x-rar-compressed" },
        { ".tar", "application/x-tar" },
        { ".gz", "application/gzip" },
        { ".txt", "text/plain" },
        { ".html", "text/html" },
        { ".css", "text/css" },
        { ".csv", "text/csv" },
        { ".md", "text/markdown" },
        { ".rtf", "application/rtf" },
        { ".wav", "audio/wav" },
        { ".mp3", "audio/mpeg" },
        { ".ogg", "audio/ogg" },
        { ".mp4", "video/mp4" },
        { ".avi", "video/x-msvideo" },
        { ".mkv", "video/x-matroska" },
        { ".geojson", "application/geo+json" }, // Tipo MIME para GeoJSON
         { ".topojson", "application/topojson" },
		 { ".bin", "application/octet-stream" },
		 { ".gpx", "application/gpx+xml" } // GPX Data
        // Agrega más extensiones según sea necesario
    })
});
// Agrega el middleware de CORS antes de UseRouting
app.UseCors(options =>
{
	options.AllowAnyOrigin();
	options.AllowAnyMethod();
	options.AllowAnyHeader();
});

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
	name: "default",
	pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
