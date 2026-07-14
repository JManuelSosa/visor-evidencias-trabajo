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
        Schema::create('evidence_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evidence_id')->constrained('work_evidence', 'id')->onDelete('cascade');
            $table->foreignId('file_id')->index('idx_ev_files_file_id')->constrained('files', 'id')->onDelete('cascade');
            $table->string('name', 100)->nullable();
            $table->string('description', 300)->nullable();
            $table->unsignedTinyInteger('sort_order')->default(0)->index('idx_ev_files_sort_order');
            $table->foreignId('created_by')->index('idx_ev_files_created_by')->constrained('users', 'id')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['evidence_id', 'file_id'], 'idx_evidence_file');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evidence_files');
    }
};
