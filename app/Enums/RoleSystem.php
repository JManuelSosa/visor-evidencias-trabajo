<?php
namespace App\Enums;

enum SystemRole:string {

    case Root = "root";
    case Supervisor = "supervisor";
    case Director = "director";
    case User = "user";

    public function label():string {
        return match($this) {
            self::Root => "Superusuario",
            self::Supervisor => "Supervisor",
            self::Director => "Director",
            self::User => "Usuario"
        };
    }

    public static function values(): array {
        return array_column(self::cases(), 'value');
    }
}
