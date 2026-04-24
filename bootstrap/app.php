<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        channels: __DIR__ . '/../routes/channels.php',
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            \App\Http\Middleware\EnsureViteIsRunning::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\UpdateUserLastSeenAt::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // When Vite dev server is not running, block the entire app
        $exceptions->renderable(function (\Illuminate\Foundation\ViteManifestNotFoundException $e) {
            return response()->view('errors.vite-offline', [], 503);
        });

        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response) {
            $errorPages = [401, 403, 404, 419, 429, 500, 503];
            $statusCode = $response->getStatusCode();

            if (in_array($statusCode, $errorPages)) {
                return Inertia\Inertia::render("errors/{$statusCode}")
                    ->toResponse(request())
                    ->setStatusCode($statusCode);
            }

            return $response;
        });
    })->create();
