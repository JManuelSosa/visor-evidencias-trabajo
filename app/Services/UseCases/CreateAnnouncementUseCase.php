<?php
namespace App\Services\UseCases;

use App\Models\Announcement;
use App\Services\Announcement\AnnouncementService;
use App\Services\Announcement\AnnouncementUrlService;
use App\Services\FileStorage\FileService;

use Illuminate\Support\Facades\DB;

class CreateAnnouncementUseCase {

    public function __construct(
        private AnnouncementService $announcementService,
        private AnnouncementUrlService $urlService,
        private FileService $fileService
    ){}

    public function createNewAnnouncement(array $data): Announcement {

        return DB::transaction(function() use ($data) {

            $announcementInfo = [
                'title' => $data['title'],
                'content' => $data['content'],
                'created_by' => $data['created_by']
            ];
            $announcementFiles = $data['files'] ?? [];
            $announcementUrls = $data['urls'] ?? [];

            $newAnnouncement = $this->announcementService->createAnnouncement($announcementInfo);
            if(!empty($announcementUrls)) $this->urlService->createAnnouncementUrls($announcementUrls, $newAnnouncement);

            if(!empty($announcementFiles)) {
                $this->announcementService->attachFiles($announcementFiles, $newAnnouncement);

                $fileIds = array_map(fn(array $data) => $data['file_id'], $announcementFiles);
                $this->fileService->syncManyFileStatus($fileIds);
            }

            $newAnnouncement->load(['urls', 'files']);
            return $newAnnouncement;
        });
    }
}
