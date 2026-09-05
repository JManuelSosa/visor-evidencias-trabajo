<?php
namespace App\Services\Announcement;

use App\Models\Announcement;
use App\Actions\CleanHtmlAction;
use Illuminate\Database\Eloquent\Collection;

class AnnouncementService {

    public function __construct(private CleanHtmlAction $cleaner){}

    public function getAnnouncements(array $withRelations = []): Collection{
        return Announcement::with($withRelations)->get();
    }

    public function createAnnouncement(array $data): Announcement {
        return Announcement::create([
            'title' => $data['title'],
            'content' => ($this->cleaner)($data['content']),
            'created_by' => $data['created_by']
        ]);
    }

    public function attachFiles(array $dataFiles, Announcement $announcement):void {

        // Ordenamos de acuerdo al orden en que el frontend planeaba que se ordenaran
        usort($dataFiles, function($a, $b) {
            return $a['sort_order'] <=> $b['sort_order'];
        });

        $dataForInsert = collect($dataFiles)->mapWithKeys(function($file, $index) {
            return [
                $file['file_id'] => [
                    'title' => $file['title'],
                    'description' => $file['description'] ?? null,
                    'sort_order' => $index + 1
                ]
            ];
        });

        $announcement->files()->attach($dataForInsert);
    }
}
