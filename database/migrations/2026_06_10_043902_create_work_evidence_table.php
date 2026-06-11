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
        Schema::create('work_evidence', function (Blueprint $table) {
            $table->id();
            $table->string('name', 80);
            $table->string('description', 3000)->nullable();
            $table->foreignId('kindergarten_id')->index('idx_work_evidence_kindergarten_id')->nullable()->constrained('kindergartens', 'id')->onDelete('set null');
            $table->foreignId('created_by')->index('idx_work_evidence_user_id')->constrained('users', 'id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('work_evidence');
    }
};
