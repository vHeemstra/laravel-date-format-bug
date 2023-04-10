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
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable()->default(null)->change();
            $table->string('email')->nullable()->change();
            $table->after('remember_token', function (Blueprint $table2) {
                $table2->string('first_name', 100)->nullable()->default(null);
                $table2->string('first_names')->nullable()->default(null);
                $table2->string('last_name')->nullable()->default(null);
                $table2->string('initials')->nullable()->default(null);
                $table2->string('gender', 100)->nullable()->default(null);
                $table2->date('date_of_birth')->nullable()->default(null);
                $table2->date('date_of_death')->nullable()->default(null);
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->nullable(false)->default(null)->change();
            $table->string('email')->nullable(false)->change();
            $table->dropColumn([
                'first_name',
                'first_names',
                'last_name',
                'initials',
                'gender',
                'date_of_birth',
                'date_of_death',
            ]);
        });
    }
};
