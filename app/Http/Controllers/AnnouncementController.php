<?php
namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Http\Requests\UpdateAnnouncementRequest;

//* Use Cases
use App\Services\UseCases\CreateAnnouncementUseCase;

//* HTTP
use Illuminate\Support\Facades\Auth;

//* Form Request
use App\Http\Requests\StoreAnnouncementRequest;

class AnnouncementController extends Controller
{

    public function __construct(private CreateAnnouncementUseCase $announcementUseCase){}

    public function createAnnouncement(StoreAnnouncementRequest $request) {

        $validatedData = $request->validated();
        $validatedData['created_by'] = Auth::id();

        $newAnnouncement = $this->announcementUseCase->createNewAnnouncement($validatedData);

    }


}
