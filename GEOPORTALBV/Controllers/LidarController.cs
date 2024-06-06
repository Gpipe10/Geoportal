using Microsoft.AspNetCore.Mvc;


namespace Lidar.Controllers
{
	
	public class LidarController : Controller
    {
        private readonly IConfiguration _configuration;

        public LidarController(IConfiguration configuration)
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
            Converter conv = new();

            if (file_key != null)
            {
                try
                {
                    string nameFile = Path.GetFileName(file_key.FileName);
                    string nameWithout = Path.GetFileNameWithoutExtension(nameFile);
                    string pathFileZip = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Content/datacloud/Zip", nameFile);
                    string pathFileLaz = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Content/datacloud/Laz", nameFile);
                    string fileLaz = @"wwwroot\Content\datacloud\Laz\" + nameFile;

                    if (Path.GetExtension(nameFile).Equals(".las", StringComparison.OrdinalIgnoreCase) || Path.GetExtension(nameFile).Equals(".laz", StringComparison.OrdinalIgnoreCase))
                    {
                        using (var stream = new FileStream(pathFileLaz, FileMode.Create, FileAccess.Write, FileShare.None))
                        {
                            file_key.CopyTo(stream);
                        }

                        bool res = conv.ConvertLaz(pathFileLaz, nameWithout);

                        if (!res)
                        {
                            var resconvert = new { mensaje = "Se produjo un error en la conversión", nombreArchivo = nameFile };
                            return Json(resconvert);
                        }

                        var response = new { mensaje = "Archivo Cargado Correctamente!", nombreSin = nameWithout, makehtml = 1 };
                        return Json(response);
                    }
                    else
                    {
                        var response = new { mensaje = "Formato de archivo no válido, debe ser: (.zip, .laz, .las)" };
                        return Json(response);
                    }
                }
                catch (Exception ex)
                {
                    var response = new { mensaje = "No se cargó el archivo seleccionado, el formato o estructura del archivo es inválido.", error = ex.Message };
                    return Json(response);
                }
            }
            else
            {
                //var response = new { mensaje = "No se seleccionó ningún archivo" };
                //return Json(response);
                var response = new { mensaje = "El archivo es demasiado grande" };
                return Json(response);
            }
        }


        [HttpPost]
        public IActionResult DeleteFile()
        {
            // Rutas de las ubicaciones de las carpetas cuyo contenido se eliminará.
            string folderPath = "wwwroot/Content/datacloud/Output"; // Reemplaza con la ruta real.
            string folderPath2 = "wwwroot/Content/datacloud/Laz"; // Reemplaza con la ruta real.
            try
            {
                // Verifica si la ruta 1 existe antes de eliminar su contenido.
                if (Directory.Exists(folderPath))
                {
                    // Elimina el contenido de la carpeta sin eliminar la carpeta en sí.
                    DirectoryInfo directory = new DirectoryInfo(folderPath);
                    foreach (FileInfo file in directory.GetFiles())
                    {
                        file.Delete();
                    }
                    foreach (DirectoryInfo subDir in directory.GetDirectories())
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

                    ViewBag.Message = "Contenido de la carpeta 1 eliminado exitosamente.";
                }
                else
                {
                    ViewBag.Message = "La ruta 1 especificada no existe.";
                }

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






        //-----------------------------
    }
}