<?php

namespace App\Enums;

enum FolderR2:string {

    case Announcement = "announcement";
    case Evidence = "evidence";
    case Profile = "profile";

    public function label():string {
        return match($this) {
            self::Announcement => "Anuncio",
            self::Evidence => "Evidencia de trabajo",
            self::Profile => "Perfil"
        };
    }

    public static function values(): array {
        return array_column(self::cases(), 'value');
    }
}
