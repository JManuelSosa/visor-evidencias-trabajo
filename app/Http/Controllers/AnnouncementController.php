<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Announcement;

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
        $this->announcementUseCase->createNewAnnouncement($validatedData);

        return response()->json(["message" => "ok"], 200);
    }
}
