<?php
namespace App\ValueObjects;

// Unidad
use App\Enums\DataUnit;
use InvalidArgumentException;

final readonly class DataSize {

    private const int BYTES_MULTIPLIER = 1024;
    private float $size;
    private DataUnit $unit;

    public function __construct(float $size, DataUnit $unit) {

        if(!is_finite($size)) throw new InvalidArgumentException("El numero debe ser finito");
        if($size < 0) throw new InvalidArgumentException("El tamaño no puede ser negativo");

        $this->size = $size;
        $this->unit = $unit;
    }

    // Constructor estático
    public static function make(float $size, DataUnit $unit):self {
        return new self($size, $unit);
    }

    public static function fromBytes(float $bytes):self {
        return new self($bytes, DataUnit::B);
    }

    public function getSize():float { return $this->size; }
    public function getUnit():DataUnit { return $this->unit; }

    // Utilidades
    public function bytesValue(): float {
        return $this->size * pow(self::BYTES_MULTIPLIER, $this->unit->getExponentToConvert());
    }

    private function convertTo(DataUnit $targetUnit):self {

        if($this->unit === $targetUnit) return $this;

        $sizeInBytes = $this->bytesValue();
        $targetSize = $sizeInBytes/pow(self::BYTES_MULTIPLIER, $targetUnit->getExponentToConvert());

        return new self($targetSize, $targetUnit);
    }

    public function toBytes():self {
        return $this->convertTo(DataUnit::B);
    }

    public function toKilobytes():self {
        return $this->convertTo(DataUnit::KB);
    }

    public function toMegabytes():self {
        return $this->convertTo(DataUnit::MB);
    }

    public function toGigabytes():self {
        return $this->convertTo(DataUnit::GB);
    }

    public function format(int $decimals = 2):string {
        return number_format($this->size, $decimals) . ' ' . $this->unit->value;
    }

    /**
     * Convierte automáticamente a la unidad más legible.
     */
    public function toHumanReadable(int $decimals = 2):string {
        $bytes = $this->bytesValue();

        if ($bytes === 0.0) {
            return "0 B";
        }

        $units = DataUnit::cases();
        $i = (int) floor(log($bytes, self::BYTES_MULTIPLIER));
        $i = min($i, count($units) - 1);

        $readableSize = $bytes / pow(self::BYTES_MULTIPLIER, $i);

        return number_format($readableSize, $decimals) . ' ' . $units[$i]->value;
    }

}
