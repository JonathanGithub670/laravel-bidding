import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::index
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:22
 * @route '/admin/settlements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/admin/settlements',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::index
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:22
 * @route '/admin/settlements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::index
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:22
 * @route '/admin/settlements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::index
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:22
 * @route '/admin/settlements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::index
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:22
 * @route '/admin/settlements'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::index
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:22
 * @route '/admin/settlements'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::index
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:22
 * @route '/admin/settlements'
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
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::approve
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:71
 * @route '/admin/settlements/{settlement}/approve'
 */
export const approve = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
});

approve.definition = {
    methods: ['post'],
    url: '/admin/settlements/{settlement}/approve',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::approve
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:71
 * @route '/admin/settlements/{settlement}/approve'
 */
approve.url = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { settlement: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { settlement: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            settlement: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        settlement:
            typeof args.settlement === 'object'
                ? args.settlement.id
                : args.settlement,
    };

    return (
        approve.definition.url
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::approve
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:71
 * @route '/admin/settlements/{settlement}/approve'
 */
approve.post = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::approve
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:71
 * @route '/admin/settlements/{settlement}/approve'
 */
const approveForm = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::approve
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:71
 * @route '/admin/settlements/{settlement}/approve'
 */
approveForm.post = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
});

approve.form = approveForm;
/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::confirmShipping
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:96
 * @route '/admin/settlements/{settlement}/confirm-shipping'
 */
export const confirmShipping = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: confirmShipping.url(args, options),
    method: 'post',
});

confirmShipping.definition = {
    methods: ['post'],
    url: '/admin/settlements/{settlement}/confirm-shipping',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::confirmShipping
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:96
 * @route '/admin/settlements/{settlement}/confirm-shipping'
 */
confirmShipping.url = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { settlement: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { settlement: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            settlement: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        settlement:
            typeof args.settlement === 'object'
                ? args.settlement.id
                : args.settlement,
    };

    return (
        confirmShipping.definition.url
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::confirmShipping
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:96
 * @route '/admin/settlements/{settlement}/confirm-shipping'
 */
confirmShipping.post = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: confirmShipping.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::confirmShipping
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:96
 * @route '/admin/settlements/{settlement}/confirm-shipping'
 */
const confirmShippingForm = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: confirmShipping.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::confirmShipping
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:96
 * @route '/admin/settlements/{settlement}/confirm-shipping'
 */
confirmShippingForm.post = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: confirmShipping.url(args, options),
    method: 'post',
});

confirmShipping.form = confirmShippingForm;
/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::markDelivered
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:109
 * @route '/admin/settlements/{settlement}/mark-delivered'
 */
export const markDelivered = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: markDelivered.url(args, options),
    method: 'post',
});

markDelivered.definition = {
    methods: ['post'],
    url: '/admin/settlements/{settlement}/mark-delivered',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::markDelivered
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:109
 * @route '/admin/settlements/{settlement}/mark-delivered'
 */
markDelivered.url = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { settlement: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { settlement: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            settlement: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        settlement:
            typeof args.settlement === 'object'
                ? args.settlement.id
                : args.settlement,
    };

    return (
        markDelivered.definition.url
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::markDelivered
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:109
 * @route '/admin/settlements/{settlement}/mark-delivered'
 */
markDelivered.post = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: markDelivered.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::markDelivered
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:109
 * @route '/admin/settlements/{settlement}/mark-delivered'
 */
const markDeliveredForm = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markDelivered.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::markDelivered
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:109
 * @route '/admin/settlements/{settlement}/mark-delivered'
 */
markDeliveredForm.post = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markDelivered.url(args, options),
    method: 'post',
});

markDelivered.form = markDeliveredForm;
/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::reject
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:122
 * @route '/admin/settlements/{settlement}/reject'
 */
export const reject = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
});

reject.definition = {
    methods: ['post'],
    url: '/admin/settlements/{settlement}/reject',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::reject
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:122
 * @route '/admin/settlements/{settlement}/reject'
 */
reject.url = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { settlement: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { settlement: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            settlement: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        settlement:
            typeof args.settlement === 'object'
                ? args.settlement.id
                : args.settlement,
    };

    return (
        reject.definition.url
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::reject
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:122
 * @route '/admin/settlements/{settlement}/reject'
 */
reject.post = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::reject
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:122
 * @route '/admin/settlements/{settlement}/reject'
 */
const rejectForm = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AuctionSettlementController::reject
 * @see app/Http/Controllers/Admin/AuctionSettlementController.php:122
 * @route '/admin/settlements/{settlement}/reject'
 */
rejectForm.post = (
    args:
        | { settlement: number | { id: number } }
        | [settlement: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
});

reject.form = rejectForm;
const AuctionSettlementController = {
    index,
    approve,
    confirmShipping,
    markDelivered,
    reject,
};

export default AuctionSettlementController;
