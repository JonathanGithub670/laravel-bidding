<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\AuctionCategory;
use App\Models\AuctionDuration;
use App\Models\BadgeRead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MyAuctionController extends Controller
{
    /**
     * Display user's auctions (submissions).
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Mark my-auctions badge as read
        BadgeRead::markRead($user->id, 'my-auctions');

        $auctions = Auction::where('seller_id', $user->id)
            ->with(['category'])
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('my-auctions/index', [
            'auctions' => $auctions,
        ]);
    }

    /**
     * Show form to create a new auction submission.
     */
    public function create(): Response
    {
        Log::info('Auction creation form accessed', [
            'user_id' => auth()->id(),
            'user_email' => auth()->user()->email ?? 'unknown',
            'ip' => request()->ip(),
        ]);

        $categories = AuctionCategory::active()->ordered()->get();
        $durations = AuctionDuration::active()->ordered()->get();

        return Inertia::render('my-auctions/create', [
            'categories' => $categories,
            'durations' => $durations,
        ]);
    }

    /**
     * Store a new auction submission (pending approval).
     */
    public function store(Request $request)
    {
        $user = $request->user();

        Log::info('Auction submission attempt started', [
            'user_id' => $user->id,
            'user_email' => $user->email,
            'ip' => $request->ip(),
            'data' => [
                'title' => $request->input('title'),
                'category_id' => $request->input('category_id'),
                'starting_price' => $request->input('starting_price'),
                'bid_increment' => $request->input('bid_increment'),
                'duration_hours' => $request->input('duration_hours'),
                'images_count' => $request->hasFile('images') ? count($request->file('images')) : 0,
            ],
        ]);

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string|min:50',
                'category_id' => 'required|exists:auction_categories,id',
                'starting_price' => 'required|integer|min:100000',
                'bid_increment' => 'required|integer|min:10000',
                'registration_fee' => 'nullable|integer|min:0',
                'duration_hours' => 'required|integer|min:1|max:168', // 1 hour to 7 days
                'images' => 'required|array|min:1|max:5',
                'images.*' => 'image|mimes:jpg,jpeg|max:2048', // Max 2MB per image, JPG/JPEG only
            ]);

            Log::info('Auction validation passed', [
                'user_id' => $user->id,
                'title' => $validated['title'],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Auction validation failed', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'errors' => $e->errors(),
                'input' => $request->except('images'),
            ]);
            throw $e;
        }

        // Process image uploads
        $imageUrls = [];
        if ($request->hasFile('images')) {
            Log::info('Processing image uploads', [
                'user_id' => $user->id,
                'images_count' => count($request->file('images')),
            ]);

            try {
                foreach ($request->file('images') as $index => $image) {
                    // Store image in 'jual_barang' directory on 'public' disk
                    $path = $image->store('jual_barang', 'public');
                    $imageUrls[] = url("storage/$path");

                    Log::debug('Image uploaded successfully', [
                        'user_id' => $user->id,
                        'image_index' => $index,
                        'path' => $path,
                        'size' => $image->getSize(),
                        'mime_type' => $image->getMimeType(),
                    ]);
                }

                Log::info('All images uploaded successfully', [
                    'user_id' => $user->id,
                    'total_images' => count($imageUrls),
                ]);
            } catch (\Exception $e) {
                Log::error('Image upload failed', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                throw $e;
            }
        }

        // Create auction
        try {
            $auction = Auction::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'category_id' => $validated['category_id'],
                'starting_price' => $validated['starting_price'],
                'current_price' => $validated['starting_price'],
                'bid_increment' => $validated['bid_increment'],
                'registration_fee' => $validated['registration_fee'] ?? 0,
                'images' => $imageUrls,
                'seller_id' => $user->id,
                'status' => 'pending', // Needs admin approval
                'starts_at' => null,
                'ends_at' => null,
                'original_ends_at' => null,
                'metadata' => [
                    'requested_duration_hours' => $validated['duration_hours'],
                ],
            ]);

            Log::info('Auction created successfully', [
                'auction_id' => $auction->id,
                'user_id' => $user->id,
                'title' => $auction->title,
                'category_id' => $auction->category_id,
                'starting_price' => $auction->starting_price,
                'bid_increment' => $auction->bid_increment,
                'images_count' => count($imageUrls),
                'status' => $auction->status,
            ]);

            return redirect()->route('my-auctions.index')
                ->with('success', 'Pengajuan lelang berhasil! Menunggu persetujuan admin.');
        } catch (\Exception $e) {
            Log::error('Failed to create auction', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'validated_data' => $validated,
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Show a specific auction detail.
     */
    public function show(Auction $auction, Request $request): Response
    {
        // Ensure user owns this auction
        if ($auction->seller_id !== $request->user()->id) {
            abort(403);
        }

        $auction->load(['category', 'bids.user']);

        return Inertia::render('my-auctions/show', [
            'auction' => $auction,
        ]);
    }

    /**
     * Store a new category (user-accessible via AJAX).
     */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:auction_categories,name',
            'icon' => 'nullable|string|max:10',
            'description' => 'nullable|string|max:500',
        ]);

        $category = AuctionCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon' => $validated['icon'] ?? '📦',
            'description' => $validated['description'] ?? null,
            'is_active' => true,
            'sort_order' => 0,
        ]);

        return response()->json($category);
    }
}
