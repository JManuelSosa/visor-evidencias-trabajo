<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\AnnouncementUrlResource;
use App\Http\Resources\AnnouncementFileResource;

class AnnouncementIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
            'author' => $this->whenLoaded('author', function(){
                return $this->author->relationLoaded('person') ? $this->author?->person?->fullName : 'Usuario de Edime';
            }),
            'urls' => AnnouncementUrlResource::collection($this->urls),
            'files' => AnnouncementFileResource::collection($this->files)
        ];
    }
}
