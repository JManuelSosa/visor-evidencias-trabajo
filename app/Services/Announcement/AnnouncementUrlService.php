<?php
namespace App\Services\Announcement;

use App\Enums\UrlType;
use App\Models\Announcement;

class AnnouncementUrlService {

    public function createAnnouncementUrls(array $dataUrls, Announcement $announcement): bool {
        $now = now();

        $dataCollection = array_map(function(array $data) use ($announcement, $now) {
            return [
                "announcement_id" => $announcement->id,
                "url" => $data['url'],
                "label" => $data['label'] ?? 'Enlace de sitio web',
                "type" => UrlType::detectFromUrl($data['url'])->value,
                "created_at" => $now,
                "updated_at" => $now
            ];
        }, $dataUrls);

        return $announcement->urls()->insert($dataCollection);
    }
}
