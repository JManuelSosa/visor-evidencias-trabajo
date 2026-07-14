<?php
namespace App\Enums;

enum FileStatus:string {

    case Pending = "pending";
    case Published = "published";
    case Orphaned = "orphaned";


    public function label():string {
        return match($this) {
            self::Pending => "Pendiente",
            self::Published => "Publicado",
            self::Orphaned => "Huérfano"
        };
    }

    public static function values(): array {
        return array_column(self::cases(), 'value');
    }

}
