using Microsoft.AspNetCore.Mvc;


namespace Gis.Controllers
{
    public class GisController : Controller
    {
        private readonly IConfiguration _configuration;

        public GisController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }

        [RequestFormLimits(ValueCountLimit = int.MaxValue)]
        [HttpPost]
        public IActionResult LoadFile(IFormFile file_key)
        {
            if (file_key != null)
            {
                try
                {
                    string nameFile = Path.GetFileName(file_key.FileName);
                    string nameWithout = Path.GetFileNameWithoutExtension(nameFile);

                    string pathFileLaz = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Content/datagis", nameFile);
                    string fileLaz = @"wwwroot\Content\datagis" + nameFile;
                    var alert = 0;

                    //---
                    if (
						Path.GetExtension(nameFile).Equals(".gpx", StringComparison.OrdinalIgnoreCase) ||
						Path.GetExtension(nameFile).Equals(".json", StringComparison.OrdinalIgnoreCase) ||
						Path.GetExtension(nameFile).Equals(".kml", StringComparison.OrdinalIgnoreCase) ||
                        Path.GetExtension(nameFile).Equals(".kmz", StringComparison.OrdinalIgnoreCase) ||
                        Path.GetExtension(nameFile).Equals(".czml", StringComparison.OrdinalIgnoreCase) ||
                        Path.GetExtension(nameFile).Equals(".geojson", StringComparison.OrdinalIgnoreCase) ||
                        Path.GetExtension(nameFile).Equals(".topojson", StringComparison.OrdinalIgnoreCase))
                    {//--- init if 


                        using (var stream = new FileStream(pathFileLaz, FileMode.Create, FileAccess.Write, FileShare.None))
                        {
                            file_key.CopyTo(stream);
                        }

                        alert = 1;
                        var response1 = new { mensaje1 = "Archivo Cargado Correctamente!", nombresin = nameWithout, nombreArchivo = nameFile, makehtml = 1 ,alert=alert};
                        return Json(response1);

                    }else{
                        alert = 2;
                        var response2 = new { mensaje2 = "Formato de archivo no válido,este debe ser: (.kmz, .kml, .czml, .geojson, .topojson, .json, .gpx)", alert = alert };
                        return Json(response2);
                    }



                }
                catch (Exception ex)
                {
                    // Manejo de excepciones, si es necesario
                }
            }


            var response = new { mensaje = "se cargo" };
            return Json(response);
        }



        //------------------------------------

        [HttpPost]
        public IActionResult DeleteFile()
        {
            // Rutas de las ubicaciones de las carpetas cuyo contenido se eliminará.

            string folderPath2 = "wwwroot/Content/datagis"; // Reemplaza con la ruta real.
            try
            {
                // Verifica si la ruta 2 existe antes de eliminar su contenido.
                if (Directory.Exists(folderPath2))
                {
                    // Elimina el contenido de la carpeta sin eliminar la carpeta en sí.
                    DirectoryInfo directory2 = new DirectoryInfo(folderPath2);
                    foreach (FileInfo file in directory2.GetFiles())
                    {
                        file.Delete();
                    }
                    foreach (DirectoryInfo subDir in directory2.GetDirectories())
                    {
                        foreach (FileInfo file in subDir.GetFiles())
                        {
                            file.Delete();
                        }
                        foreach (DirectoryInfo subSubDir in subDir.GetDirectories())
                        {
                            subSubDir.Delete(true);
                        }
                    }

                    ViewBag.Message += " Contenido de la carpeta 2 eliminado exitosamente.";
                }
                else
                {
                    ViewBag.Message += " La ruta 2 especificada no existe.";
                }
            }
            catch (Exception ex)
            {
                // Manejo de errores
                ViewBag.Message = "Ocurrió un error al eliminar el contenido de la carpeta: " + ex.Message;
            }

            return RedirectToAction("Index");
        }
























        //--------------


    }
}
