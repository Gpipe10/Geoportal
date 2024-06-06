using Microsoft.AspNetCore.Mvc;


namespace Viewer_3._0.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Index(string viewerType)
        {
            if (viewerType == "Lidar")
            {
                return RedirectToAction("Index", "Lidar");
            }
            else if (viewerType == "Gis")
            {
                return RedirectToAction("Index", "Gis");
            }

            // Manejo adicional si es necesario
            return View();
        }
    }
}