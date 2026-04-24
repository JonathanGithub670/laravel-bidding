import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../wayfinder';
/**
 * @see routes/web.php:163
 * @route '/auctions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/auctions',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see routes/web.php:163
 * @route '/auctions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see routes/web.php:163
 * @route '/auctions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see routes/web.php:163
 * @route '/auctions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see routes/web.php:163
 * @route '/auctions'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see routes/web.php:163
 * @route '/auctions'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see routes/web.php:163
 * @route '/auctions'
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
 * @see \App\Http\Controllers\AuctionListController::list
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
});

list.definition = {
    methods: ['get', 'head'],
    url: '/auctions/list',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\AuctionListController::list
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AuctionListController::list
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\AuctionListController::list
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\AuctionListController::list
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
const listForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AuctionListController::list
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
listForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\AuctionListController::list
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
listForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: list.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

list.form = listForm;
/**
 * @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
    url: '/auctions/{auction}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
 * @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
 * @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
 * @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
 * @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
 * @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
/**
 * @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/auctions/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
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
 * @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/auctions',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;
/**
 * @see \App\Http\Controllers\AuctionController::bid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
export const bid = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: bid.url(args, options),
    method: 'post',
});

bid.definition = {
    methods: ['post'],
    url: '/auctions/{auction}/bid',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AuctionController::bid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
bid.url = (
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
        bid.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\AuctionController::bid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
bid.post = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: bid.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionController::bid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
const bidForm = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: bid.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionController::bid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
bidForm.post = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: bid.url(args, options),
    method: 'post',
});

bid.form = bidForm;
/**
 * @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
export const register = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: register.url(args, options),
    method: 'post',
});

register.definition = {
    methods: ['post'],
    url: '/auctions/{auction}/register',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
register.url = (
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
        register.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
register.post = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: register.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
const registerForm = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: register.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
registerForm.post = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: register.url(args, options),
    method: 'post',
});

register.form = registerForm;
/**
 * @see \App\Http\Controllers\AuctionActivityController::activity
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
export const activity = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: activity.url(args, options),
    method: 'post',
});

activity.definition = {
    methods: ['post'],
    url: '/auctions/{auction}/activity',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\AuctionActivityController::activity
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
activity.url = (
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
        activity.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\AuctionActivityController::activity
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
activity.post = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: activity.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionActivityController::activity
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
const activityForm = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: activity.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\AuctionActivityController::activity
 * @see app/Http/Controllers/AuctionActivityController.php:15
 * @route '/auctions/{auction}/activity'
 */
activityForm.post = (
    args:
        | { auction: string | { uuid: string } }
        | [auction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: activity.url(args, options),
    method: 'post',
});

activity.form = activityForm;
const auctions = {
    index: Object.assign(index, index),
    list: Object.assign(list, list),
    show: Object.assign(show, show),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    bid: Object.assign(bid, bid),
    register: Object.assign(register, register),
    activity: Object.assign(activity, activity),
};

export default auctions;
