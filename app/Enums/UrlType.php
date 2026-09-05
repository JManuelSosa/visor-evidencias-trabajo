<?php
namespace App\Enums;

enum UrlType:string {

    case Youtube = "youtube";
    case DriveFolder = "drive_folder";
    case DriveDocs = "drive_doc";
    case DriveFile = "drive_file";
    case Generic = "generic";

    public function label():string {
        return match($this) {
            self::Youtube => "YouTube",
            self::DriveFolder => "Carpeta de Drive",
            self::DriveDocs => "Documento de Drive",
            self::DriveFile => "Archivo de Drive",
            self::Generic => "Sitio Web"
        };
    }

    public static function detectFromUrl(string $url): self {
        $cleanUrl = trim($url);

        // Garantizar que el parse_url identifique el host
        if (!preg_match('#^[a-zA-Z][a-zA-Z0-9+.-]*://#', $cleanUrl)) {
            $cleanUrl = 'https://' . ltrim($cleanUrl, '/');
        }

        $host = parse_url($cleanUrl, PHP_URL_HOST);
        $path = parse_url($cleanUrl, PHP_URL_PATH) ?? '';

        if (!$host) {
            return self::Generic;
        }

        $host = strtolower($host);

        // 1. Detección de Google Drive
        if (self::isGoogleDriveHost($host)) {
            if (str_starts_with($path, '/file/d/')) return self::DriveFile;
            if (str_starts_with($path, '/drive/folders/')) return self::DriveFolder;
            if (self::isDriveDocumentPath($path)) return self::DriveDocs;
        }

        // 2. Detección de YouTube
        if (self::isYoutubeHost($host)) {
            return self::Youtube;
        }

        return self::Generic;
    }

    private static function isGoogleDriveHost(string $host): bool {
        $hostDriveAllowed = ['drive.google.com', 'docs.google.com'];
        return in_array($host, $hostDriveAllowed, true);
    }

    private static function isDriveDocumentPath(string $path): bool {
        $prefixes = [
            '/document/d/',
            '/spreadsheets/d/',
            '/presentation/d/'
        ];

        foreach ($prefixes as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return true;
            }
        }

        return false;
    }

    private static function isYoutubeHost(string $host): bool {
        if ($host === 'youtu.be') {
            return true;
        }

        $allowedSuffixes = [
            'youtube.com',
            'youtube-nocookie.com',
        ];

        foreach ($allowedSuffixes as $suffix) {
            if ($host === $suffix || str_ends_with($host, '.' . $suffix)) {
                return true;
            }
        }

        return false;
    }
}
