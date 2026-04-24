import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\TopupController::index
 * @see app/Http/Controllers/TopupController.php:21
 * @route '/topups'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/topups',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\TopupController::index
 * @see app/Http/Controllers/TopupController.php:21
 * @route '/topups'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\TopupController::index
 * @see app/Http/Controllers/TopupController.php:21
 * @route '/topups'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\TopupController::index
 * @see app/Http/Controllers/TopupController.php:21
 * @route '/topups'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\TopupController::index
 * @see app/Http/Controllers/TopupController.php:21
 * @route '/topups'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\TopupController::index
 * @see app/Http/Controllers/TopupController.php:21
 * @route '/topups'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\TopupController::index
 * @see app/Http/Controllers/TopupController.php:21
 * @route '/topups'
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
 * @see \App\Http\Controllers\TopupController::create
 * @see app/Http/Controllers/TopupController.php:35
 * @route '/topups/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/topups/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\TopupController::create
 * @see app/Http/Controllers/TopupController.php:35
 * @route '/topups/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\TopupController::create
 * @see app/Http/Controllers/TopupController.php:35
 * @route '/topups/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\TopupController::create
 * @see app/Http/Controllers/TopupController.php:35
 * @route '/topups/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\TopupController::create
 * @see app/Http/Controllers/TopupController.php:35
 * @route '/topups/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\TopupController::create
 * @see app/Http/Controllers/TopupController.php:35
 * @route '/topups/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\TopupController::create
 * @see app/Http/Controllers/TopupController.php:35
 * @route '/topups/create'
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
 * @see \App\Http\Controllers\TopupController::store
 * @see app/Http/Controllers/TopupController.php:62
 * @route '/topups'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/topups',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\TopupController::store
 * @see app/Http/Controllers/TopupController.php:62
 * @route '/topups'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\TopupController::store
 * @see app/Http/Controllers/TopupController.php:62
 * @route '/topups'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\TopupController::store
 * @see app/Http/Controllers/TopupController.php:62
 * @route '/topups'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\TopupController::store
 * @see app/Http/Controllers/TopupController.php:62
 * @route '/topups'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;
/**
 * @see \App\Http\Controllers\TopupController::show
 * @see app/Http/Controllers/TopupController.php:86
 * @route '/topups/{topup}'
 */
export const show = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/topups/{topup}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\TopupController::show
 * @see app/Http/Controllers/TopupController.php:86
 * @route '/topups/{topup}'
 */
show.url = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { topup: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { topup: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            topup: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        topup: typeof args.topup === 'object' ? args.topup.id : args.topup,
    };

    return (
        show.definition.url
            .replace('{topup}', parsedArgs.topup.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\TopupController::show
 * @see app/Http/Controllers/TopupController.php:86
 * @route '/topups/{topup}'
 */
show.get = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\TopupController::show
 * @see app/Http/Controllers/TopupController.php:86
 * @route '/topups/{topup}'
 */
show.head = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\TopupController::show
 * @see app/Http/Controllers/TopupController.php:86
 * @route '/topups/{topup}'
 */
const showForm = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\TopupController::show
 * @see app/Http/Controllers/TopupController.php:86
 * @route '/topups/{topup}'
 */
showForm.get = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\TopupController::show
 * @see app/Http/Controllers/TopupController.php:86
 * @route '/topups/{topup}'
 */
showForm.head = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
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
 * @see \App\Http\Controllers\TopupController::simulatePayment
 * @see app/Http/Controllers/TopupController.php:107
 * @route '/topups/{topup}/simulate'
 */
export const simulatePayment = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: simulatePayment.url(args, options),
    method: 'post',
});

simulatePayment.definition = {
    methods: ['post'],
    url: '/topups/{topup}/simulate',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\TopupController::simulatePayment
 * @see app/Http/Controllers/TopupController.php:107
 * @route '/topups/{topup}/simulate'
 */
simulatePayment.url = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { topup: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { topup: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            topup: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        topup: typeof args.topup === 'object' ? args.topup.id : args.topup,
    };

    return (
        simulatePayment.definition.url
            .replace('{topup}', parsedArgs.topup.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\TopupController::simulatePayment
 * @see app/Http/Controllers/TopupController.php:107
 * @route '/topups/{topup}/simulate'
 */
simulatePayment.post = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: simulatePayment.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\TopupController::simulatePayment
 * @see app/Http/Controllers/TopupController.php:107
 * @route '/topups/{topup}/simulate'
 */
const simulatePaymentForm = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: simulatePayment.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\TopupController::simulatePayment
 * @see app/Http/Controllers/TopupController.php:107
 * @route '/topups/{topup}/simulate'
 */
simulatePaymentForm.post = (
    args:
        | { topup: number | { id: number } }
        | [topup: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: simulatePayment.url(args, options),
    method: 'post',
});

simulatePayment.form = simulatePaymentForm;
const TopupController = { index, create, store, show, simulatePayment };

export default TopupController;
