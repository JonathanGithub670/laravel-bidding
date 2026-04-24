import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\MyAuctionController::index
 * @see app/Http/Controllers/MyAuctionController.php:20
 * @route '/my-auctions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/my-auctions',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\MyAuctionController::index
 * @see app/Http/Controllers/MyAuctionController.php:20
 * @route '/my-auctions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\MyAuctionController::index
 * @see app/Http/Controllers/MyAuctionController.php:20
 * @route '/my-auctions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\MyAuctionController::index
 * @see app/Http/Controllers/MyAuctionController.php:20
 * @route '/my-auctions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::index
 * @see app/Http/Controllers/MyAuctionController.php:20
 * @route '/my-auctions'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::index
 * @see app/Http/Controllers/MyAuctionController.php:20
 * @route '/my-auctions'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\MyAuctionController::index
 * @see app/Http/Controllers/MyAuctionController.php:20
 * @route '/my-auctions'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;
/**
 * @see \App\Http\Controllers\MyAuctionController::create
 * @see app/Http/Controllers/MyAuctionController.php:40
 * @route '/my-auctions/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/my-auctions/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\MyAuctionController::create
 * @see app/Http/Controllers/MyAuctionController.php:40
 * @route '/my-auctions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\MyAuctionController::create
 * @see app/Http/Controllers/MyAuctionController.php:40
 * @route '/my-auctions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\MyAuctionController::create
 * @see app/Http/Controllers/MyAuctionController.php:40
 * @route '/my-auctions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::create
 * @see app/Http/Controllers/MyAuctionController.php:40
 * @route '/my-auctions/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::create
 * @see app/Http/Controllers/MyAuctionController.php:40
 * @route '/my-auctions/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\MyAuctionController::create
 * @see app/Http/Controllers/MyAuctionController.php:40
 * @route '/my-auctions/create'
 */
createForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

create.form = createForm;
/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:60
 * @route '/my-auctions'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/my-auctions',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:60
 * @route '/my-auctions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:60
 * @route '/my-auctions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:60
 * @route '/my-auctions'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:60
 * @route '/my-auctions'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;
/**
 * @see \App\Http\Controllers\MyAuctionController::storeCategory
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
export const storeCategory = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: storeCategory.url(options),
    method: 'post',
});

storeCategory.definition = {
    methods: ['post'],
    url: '/my-auctions/categories',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\MyAuctionController::storeCategory
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
storeCategory.url = (options?: RouteQueryOptions) => {
    return storeCategory.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\MyAuctionController::storeCategory
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
storeCategory.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: storeCategory.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::storeCategory
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
const storeCategoryForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: storeCategory.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::storeCategory
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
storeCategoryForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: storeCategory.url(options),
    method: 'post',
});

storeCategory.form = storeCategoryForm;
/**
 * @see \App\Http\Controllers\MyAuctionController::show
 * @see app/Http/Controllers/MyAuctionController.php:191
 * @route '/my-auctions/{auction}'
 */
export const show = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/my-auctions/{auction}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\MyAuctionController::show
 * @see app/Http/Controllers/MyAuctionController.php:191
 * @route '/my-auctions/{auction}'
 */
show.url = (
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
        show.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\MyAuctionController::show
 * @see app/Http/Controllers/MyAuctionController.php:191
 * @route '/my-auctions/{auction}'
 */
show.get = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\MyAuctionController::show
 * @see app/Http/Controllers/MyAuctionController.php:191
 * @route '/my-auctions/{auction}'
 */
show.head = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::show
 * @see app/Http/Controllers/MyAuctionController.php:191
 * @route '/my-auctions/{auction}'
 */
const showForm = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::show
 * @see app/Http/Controllers/MyAuctionController.php:191
 * @route '/my-auctions/{auction}'
 */
showForm.get = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\MyAuctionController::show
 * @see app/Http/Controllers/MyAuctionController.php:191
 * @route '/my-auctions/{auction}'
 */
showForm.head = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

show.form = showForm;
const MyAuctionController = { index, create, store, storeCategory, show };

export default MyAuctionController;
