<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Enums\FileStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('filename', 300);
            $table->string('storage_path', 4096);
            $table->unsignedBigInteger('file_size_bytes');
            $table->string('mime_type');
            $table->string('file_type');
            $table->foreignId('uploaded_by')->index('idx_file_uploaded_by')->nullable()->constrained('users', 'id')->onDelete('set null');
            $table->timestamp('uploaded_at')->useCurrent();

            // Campos nuevos
            $table->enum('file_status', FileStatus::values())->default(FileStatus::Pending->value)->index('idx_file_status');
            $table->string('upload_id')->nullable()->index('idx_file_upload_id');
            $table->unsignedSmallInteger('total_parts')->nullable();
            $table->unsignedSmallInteger('uploaded_parts')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();

            $table->index(['file_status', 'uploaded_at'], 'idx_file_status_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
