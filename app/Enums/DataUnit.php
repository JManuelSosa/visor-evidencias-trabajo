<?php
namespace App\Enums;

enum DataUnit:string {

    case B = "B";
    case KB = "KB";
    case MB = "MB";
    case GB = "GB";

    public function getExponentToConvert():int {
        return match ($this) {
            self::B => 0,
            self::KB => 1,
            self::MB => 2,
            self::GB => 3
        };
    }
}
