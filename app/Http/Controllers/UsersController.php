<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

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
