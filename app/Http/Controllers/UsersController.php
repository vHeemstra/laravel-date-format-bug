<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Users/Index', [
            'users' => User::all(),
            'status' => session('status'),
        ]);
    }

    /**
     * Create new user
     */
    public function store(UserStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
            $data['password'] = Hash::make($request->validated('password'));
        } else {
            // Generate random password
            $data['password'] = Hash::make(Str::random(20));
        }

        $user = User::create($data);

        event(new Registered($user));

        return response()->json([
            'status' => 'ok',
            'user' => $user,
        ]);
    }

    /**
     * Update user
     * TODO: limit access to admin only
     */
    public function update(UserUpdateRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        $user->fill($data);

        // dd([
        //     $data['date_of_birth'],            // "20-01-2000"
        //     $user->date_of_birth,              // Carbon instance with correct date (20 jan 2000)
        //     $user->date_of_birth->toJSON(),    // "2000-01-20T00:00:00.000000Z"
        //     $user->date_of_birth->toString(),  // "Thu Jan 20 2000 00:00:00 GMT+0000"
        //     $user->date_of_birth->toArray(),   // [ ..., timestamp: 948326400, formatted: "2000-01-20 00:00:00" ]
        //     $user->date_of_birth->serialize(), // "O:25:"Illuminate\Support\Carbon":3:{s:4:"date";s:26:"2000-01-20 00:00:00.000000";s:13:"timezone_type";i:3;s:8:"timezone";s:3:"UTC";}"
        //     (string) $user->date_of_birth,     // "2000-01-20 00:00:00"
        //     $user->toArray(),                  // [ ..., date_of_birth: "20-01-2000" ]
        // ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // DB::enableQueryLog();
        // try {
        //    $user->save();
        // } catch (\Exception $e) {}
        // dd( DB::getQueryLog() ); // Empty array

        $user->save();

        return response()->json([
            'status' => 'ok',
            'user' => $user,
        ]);
    }

    /**
     * Delete user.
     * TODO: limit access to admin only
     */
    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Can\'t delete own account this way. Go to your Profile page.',
                'user' => $user,
            ]);
        }

        $user->delete();

        return response()->json([
            'status' => 'ok',
            'user' => $user,
        ]);
    }
}
