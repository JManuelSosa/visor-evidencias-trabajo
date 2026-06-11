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
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->string("name", 60);
            $table->string("paternal_last_name", 60);
            $table->string("maternal_last_name", 60)->nullable();
            $table->string("phone", 10)->nullable();
            $table->foreignId("user_id")->unique('idx_people_person_user')->constrained("users", "id")->onDelete("cascade");
            $table->foreignId("photo_id")->nullable()->constrained("files", "id")->onDelete("set null");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};
