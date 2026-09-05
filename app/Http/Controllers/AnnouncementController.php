<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Announcement;

//* Services
use App\Services\Announcement\AnnouncementService;

//* Use Cases
use App\Services\UseCases\CreateAnnouncementUseCase;

//* HTTP
use Illuminate\Support\Facades\Auth;

//* Form Request
use App\Http\Requests\StoreAnnouncementRequest;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class AnnouncementController extends Controller
{
    public function __construct(
        private AnnouncementService $announcementService,
        private CreateAnnouncementUseCase $announcementUseCase
    ){}

    public function index(){
        $announcements = $this->announcementService->getAnnouncements(['urls', 'files']);
        return Inertia::render('App/Announcements/Announcement', [
            "announcements" => $announcements
        ]);
    }

    public function create(){
        return Inertia::render('App/Announcements/AnnouncementForm');
    }

    public function store(StoreAnnouncementRequest $request) {

        $validatedData = $request->validated();
        $validatedData['created_by'] = Auth::id();

        try {
            $announcement = $this->announcementUseCase->createNewAnnouncement($validatedData);
            return redirect()->route('announcements.index')->with('success', 'Anuncio creado exitosamente');
        }
        catch(QueryException $dbException){
            Log::error("Error al crear el anuncio" . $dbException->getMessage(), ["data" => $validatedData]);
            return redirect()->back()->withInput()->with('error', 'Ocurrió un error al crear el anuncio. Reintente nuevamente');
        }
        catch(Exception $error){
            Log::error("Error inesperado al crear el anuncio" . $error->getMessage());
            return redirect()->back()->withInput()->with('error', 'El sistema no puede procesar tu solicitud en este momento');
        }
    }
}
