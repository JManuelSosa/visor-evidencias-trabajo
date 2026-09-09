<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementFileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "url" => $this->public_url,
            "mime_type" => $this->mime_type,
            "file_type" => $this->file_type,
            "title" => $this->whenPivotLoaded('announcement_files', fn() => $this->pivot->title),
            "sort_order" => $this->whenPivotLoaded('announcement_files', fn() => $this->pivot->sort_order),
        ];
    }
}
