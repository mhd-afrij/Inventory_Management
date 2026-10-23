<?php

namespace App\Http\Controllers;

use App\Models\LoginHistory;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoginHistoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = LoginHistory::with('user:id,name,email');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('date_from')) {
            $query->where('login_at', '>=', Carbon::parse($request->date_from)->startOfDay());
        }

        if ($request->filled('date_to')) {
            $query->where('login_at', '<=', Carbon::parse($request->date_to)->endOfDay());
        }

        $histories = $query->orderBy('login_at', 'desc')->paginate(15);

        return response()->json($histories, 200);
    }
}
