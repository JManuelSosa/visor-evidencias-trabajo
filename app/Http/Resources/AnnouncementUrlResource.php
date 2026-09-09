<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use App\Enums\UrlType;

class AnnouncementUrlResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "url" => $this->url,
            "label" => $this->label,
            "type" => $this->type->label() ?? "Enlace desconocido"
        ];
    }
}
