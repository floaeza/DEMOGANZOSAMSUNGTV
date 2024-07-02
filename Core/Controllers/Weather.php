<?php
/* Creado por: Tania Maldonado
 * Fecha: Noviembre 2019
 * Tipo: Controlador
 */

    require_once '../Models/Utilities.php';
    require_once '../Models/Database.php';
    require_once '../DataAccess/Config.php';
    
    $CurrentController = 'WeatherController';

    $ConfigData  = new Config('system', $CurrentController);
    $UtilitiesModel = new Utilities();
    
    $CentralServer = $ConfigData->getConfigByName('CentralServer');

/*==============================================================================
 *                        CARGA PARAMETROS DEL DISPOSITIVO
 *==============================================================================*/
    
    
    // $WeatherSource = $CentralServer.'Weather/MVC.txt';
    
    // $WeatherInfo= $UtilitiesModel->GetDataFromUrl($WeatherSource);
    // //$WeatherInfo= '{"latitude":22.928263,"longitude":-109.819273,"timezone":"America/Mazatlan","currently":{"time":1577485801,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":73.74,"apparentTemperature":73.73,"dewPoint":59.95,"humidity":0.62,"pressure":1013.4,"windSpeed":9.2,"windGust":10.82,"windBearing":258,"cloudCover":0.18,"uvIndex":2,"visibility":10,"ozone":287},"offset":-7}';
   
    // $Summary = $UtilitiesModel->getBetween($WeatherInfo, '"summary":"', '",');
    // $Icon = $UtilitiesModel->getBetween($WeatherInfo, '"icon":"', '",');
    // $Temperature = $UtilitiesModel->getBetween($WeatherInfo, '"temperature":', ',"apparent');
    
    // if(empty($Summary)){
        $Summary = 'Clear';
        $Icon = 'clear-day';
        $Temperature = '73.74';
    // }
    $json_file_path = '/var/www/html/BBINCO/Admin/Views/Assets/Python/weatherForecast.json';

    // Verifica si el archivo existe
    if (file_exists($json_file_path)) {
        // Lee el contenido del archivo JSON en una cadena
        $json_data = file_get_contents($json_file_path);
    
        // Decodifica el archivo JSON en un arreglo asociativo
        $data = json_decode($json_data, true);
    
        if ($data === null) {
            // Manejo de errores si no se pudo decodificar el JSON
            echo "Error al decodificar el JSON.";
        } else {
            // Obtiene la fecha actual en formato YYYY-MM-DD
            $fecha_actual = date('Y-m-d');
    
            // Busca el objeto correspondiente a la fecha actual en el arreglo de objetos
            foreach ($data as $clima) {
                if ($clima['valid_date'] === $fecha_actual) {
                    // Obtiene la temperatura de la fecha actual
                    $temperatura_actual = $clima['temp'];

                    $temperatura_fahrenheit = ($temperatura_actual * 9/5) + 32;
                    // echo "La temperatura actual es: " . $temperatura_actual . "°C";
                    echo json_encode(array('Summary' => $Summary, 'Icon' => $Icon, 'Temperature' => $temperatura_fahrenheit));
                    break; // Termina el bucle una vez que se encuentra la fecha actual
                }
            }
        }
    } else {
        // echo "El archivo JSON no existe en la ubicación especificada.";
    }
    
    