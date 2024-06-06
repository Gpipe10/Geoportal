using System;
using System.Diagnostics;
using System.IO.Compression;
using System.Reflection.Metadata;

namespace Lidar.Controllers
{
    public class Converter
    {


        
        public bool ConvertLaz(string fileLaz, string pointcloud)
        {
            // Ruta al ejecutable de Potree Converter
            string potreeConverterPath = @"wwwroot\Content\PotreeConverter\PotreeConverter.exe";
            string outputPath = @"wwwroot\Content\datacloud\Output";
           

            // Crea el nombre de la carpeta de salida
            var pathroot = "wwwroot/Content/datacloud/Output/data_conv".Replace("/", @"\");
            var pathdata = Path.Combine(Directory.GetCurrentDirectory(), pathroot);

            if (Directory.Exists(pathdata))
            {
                Directory.Delete(pathdata, true);
            }

            string outputFolder = System.IO.Path.Combine(outputPath, pointcloud);

            // Cmd
            string[] command = {
            potreeConverterPath, fileLaz.Replace("/", @"\"), "-o", outputFolder
                 };

            string commandLine = string.Join(" ", command);

            try
            {
                // Crea un proceso para ejecutar el comando
                ProcessStartInfo psi = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C {commandLine}", // /C ejecuta el comando y luego se cierra cmd.exe
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true, // Agrega esta línea
                    CreateNoWindow = false
                };

                Process process = new Process
                {
                    StartInfo = psi
                };

                process.Start();

                string standardOutput = process.StandardOutput.ReadToEnd(); // Captura la salida estándar
                string errorOutput = process.StandardError.ReadToEnd(); // Captura la salida de error

                process.WaitForExit();

                // Guarda la salida estándar y de error en archivos de registro
                string logFilePathStandard = "wwwroot/Content/datacloud/CMD/res_standard.txt";
                string logFilePathError = "wwwroot/Content/datacloud/CMD/res_error.txt";

                File.WriteAllText(logFilePathStandard, standardOutput);
                File.WriteAllText(logFilePathError, errorOutput);

                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error: {e.Message}");
                return false;
            }
        }







       /* public void UnZip(string pathFileZip)
        {

            // Directorio de extracción
            var pathExtraction = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Content/datacloud/Output");
            var pathdata = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Content/datacloud/Output/data_conv");

            if (Directory.Exists(pathdata))
            {
                Directory.Delete(pathdata, true);
            }

            // Crear directorio de extracción si no existe
            Directory.CreateDirectory(pathExtraction);

            // Descomprimir el archivo ZIP
            ZipFile.ExtractToDirectory(pathFileZip, pathExtraction);


        }*/

    }
}





