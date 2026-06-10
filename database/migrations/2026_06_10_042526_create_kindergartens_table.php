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
        Schema::create('kindergartens', function (Blueprint $table) {
            $table->id();
            $table->string("name", 80);
            $table->string("cct", 10)->unique("idx_cct");
            $table->foreignId("zone_id")->nullable()->index('idx_zone_id')->constrained("zones", "id")->onDelete("set null");
            $table->foreignId("director_id")->unique("idx_director_id")->nullable()->constrained("users", "id")->onDelete("set null");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kindergartens');
    }
};
