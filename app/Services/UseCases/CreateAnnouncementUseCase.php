<?php
namespace App\Services\UseCases;

use App\Models\Announcement;
use App\Services\Announcement\AnnouncementService;
use Illuminate\Support\Facades\DB;

class CreateAnnouncementUseCase {

    public function __construct(private AnnouncementService $announcementService){}

    public function createNewAnnouncement(array $data): object {

        return DB::transaction(function() use ($data) {

            $announcementInfo = $data;
            $announcementFiles = $data['files'];
            $announcementUrls = $data['urls'];

            $newAnnouncement = $this->announcementService->createAnnouncement($announcementInfo);
            $this->announcementService->attachFiles($announcementFiles, $newAnnouncement);



        });
    }


}
