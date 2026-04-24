import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\AuctionActivityController::store
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
export const store = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/auctions/{auction}/activity',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AuctionActivityController::store
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
store.url = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auction: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { auction: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            auction: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        auction:
            typeof args.auction === 'object' ? args.auction.uuid : args.auction,
    };

    return (
        store.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\AuctionActivityController::store
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
store.post = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionActivityController::store
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
const storeForm = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionActivityController::store
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
storeForm.post = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
});

store.form = storeForm;
const AuctionActivityController = { store };

export default AuctionActivityController;
