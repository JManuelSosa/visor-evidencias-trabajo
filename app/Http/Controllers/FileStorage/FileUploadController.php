<?php
namespace App\Http\Controllers\FileStorage;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

//* FormRequest
use App\Http\Requests\FileStorage\FileRequest;

//* UseCases
use App\Services\UseCases\FileUploadUseCase;

class FileUploadController extends Controller
{

    public function __construct(private FileUploadUseCase $fileUploadUseCase){}

    public function presignedUrl(FileRequest $request):JsonResponse {

        $validatedData = $request->validated();

        $data = [
            ...$validatedData,
            "file_type" => explode('/', $validatedData['mime_type'])[0],
            "file_size_bytes" => $validatedData['size'],
            "uploaded_by" => Auth::id()
        ];

        $result = $this->fileUploadUseCase->uploadByPresignedUrl($data);

        return response()->json($result);
    }

    public function completeUpload(){

    }

}
