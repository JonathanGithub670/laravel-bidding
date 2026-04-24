<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Ensures that the Vite dev server is running in local/development environment.
 * When Vite is not running, the entire application is blocked and a
 * "Frontend Offline" error page is shown.
 *
 * Vite creates a `public/hot` file when `npm run dev` is active.
 * This middleware checks for that file's existence.
 */
class EnsureViteIsRunning
{
    public function handle(Request $request, Closure $next): Response
    {
        // Only enforce in local/development environment
        if (!app()->environment('local', 'development')) {
            return $next($request);
        }

        // Check if the Vite hot file exists (created by `npm run dev`)
        $hotFilePath = public_path('hot');

        if (!file_exists($hotFilePath)) {
            return response()->view('errors.vite-offline', [], 503);
        }

        return $next($request);
    }
}
