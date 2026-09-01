<?php
namespace App\Services\Announcement;

use App\Models\Announcement;

class AnnouncementService {

    public function createAnnouncement(array $data): Announcement {
        return Announcement::create([
            'title' => $data['title'],
            'content' => $data['content'],
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

    public function attachUrls(){

    }

}
