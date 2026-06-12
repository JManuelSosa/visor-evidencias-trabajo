<?php
namespace App\Enums;

enum UrlType:string {

    case Youtube = "youtube";
    case DriveFolder = "drive_folder";
    case DriveDocs = "drive_doc";
    case Generic = "generic";

    public function label():string {
        return match($this) {
            self::Youtube => "YouTube",
            self::DriveFolder => "Carpeta de Drive",
            self::DriveDocs => "Documento de Drive",
            self::Generic => "Sitio Web"
        };
    }
}
