<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('announcement_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->index('idx_ann_files_announcement')->constrained('announcements', 'id')->onDelete('cascade');
            $table->foreignId('file_id')->constrained('files', 'id')->onDelete('cascade')->index('idx_ann_files_file_id');
            $table->string('title')->nullable();
            $table->string('description')->nullable();
            $table->unsignedTinyInteger('sort_order')->default(0)->index('idx_ann_files_sort_order');
            $table->unique(['announcement_id', 'file_id'], 'idx_ann_files_file_unique');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcement_files');
    }
};
