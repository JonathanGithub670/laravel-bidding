import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\BankAccountController::index
 * @see app/Http/Controllers/BankAccountController.php:15
 * @route '/bank-accounts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/bank-accounts',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\BankAccountController::index
 * @see app/Http/Controllers/BankAccountController.php:15
 * @route '/bank-accounts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\BankAccountController::index
 * @see app/Http/Controllers/BankAccountController.php:15
 * @route '/bank-accounts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\BankAccountController::index
 * @see app/Http/Controllers/BankAccountController.php:15
 * @route '/bank-accounts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\BankAccountController::index
 * @see app/Http/Controllers/BankAccountController.php:15
 * @route '/bank-accounts'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\BankAccountController::index
 * @see app/Http/Controllers/BankAccountController.php:15
 * @route '/bank-accounts'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\BankAccountController::index
 * @see app/Http/Controllers/BankAccountController.php:15
 * @route '/bank-accounts'
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
 * @see \App\Http\Controllers\BankAccountController::store
 * @see app/Http/Controllers/BankAccountController.php:31
 * @route '/bank-accounts'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/bank-accounts',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\BankAccountController::store
 * @see app/Http/Controllers/BankAccountController.php:31
 * @route '/bank-accounts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\BankAccountController::store
 * @see app/Http/Controllers/BankAccountController.php:31
 * @route '/bank-accounts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\BankAccountController::store
 * @see app/Http/Controllers/BankAccountController.php:31
 * @route '/bank-accounts'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\BankAccountController::store
 * @see app/Http/Controllers/BankAccountController.php:31
 * @route '/bank-accounts'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;
/**
 * @see \App\Http\Controllers\BankAccountController::update
 * @see app/Http/Controllers/BankAccountController.php:59
 * @route '/bank-accounts/{bankAccount}'
 */
export const update = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/bank-accounts/{bankAccount}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\BankAccountController::update
 * @see app/Http/Controllers/BankAccountController.php:59
 * @route '/bank-accounts/{bankAccount}'
 */
update.url = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bankAccount: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { bankAccount: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            bankAccount: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        bankAccount:
            typeof args.bankAccount === 'object'
                ? args.bankAccount.id
                : args.bankAccount,
    };

    return (
        update.definition.url
            .replace('{bankAccount}', parsedArgs.bankAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\BankAccountController::update
 * @see app/Http/Controllers/BankAccountController.php:59
 * @route '/bank-accounts/{bankAccount}'
 */
update.put = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\BankAccountController::update
 * @see app/Http/Controllers/BankAccountController.php:59
 * @route '/bank-accounts/{bankAccount}'
 */
const updateForm = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\BankAccountController::update
 * @see app/Http/Controllers/BankAccountController.php:59
 * @route '/bank-accounts/{bankAccount}'
 */
updateForm.put = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

update.form = updateForm;
/**
 * @see \App\Http\Controllers\BankAccountController::destroy
 * @see app/Http/Controllers/BankAccountController.php:86
 * @route '/bank-accounts/{bankAccount}'
 */
export const destroy = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/bank-accounts/{bankAccount}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\BankAccountController::destroy
 * @see app/Http/Controllers/BankAccountController.php:86
 * @route '/bank-accounts/{bankAccount}'
 */
destroy.url = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bankAccount: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { bankAccount: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            bankAccount: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        bankAccount:
            typeof args.bankAccount === 'object'
                ? args.bankAccount.id
                : args.bankAccount,
    };

    return (
        destroy.definition.url
            .replace('{bankAccount}', parsedArgs.bankAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\BankAccountController::destroy
 * @see app/Http/Controllers/BankAccountController.php:86
 * @route '/bank-accounts/{bankAccount}'
 */
destroy.delete = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\BankAccountController::destroy
 * @see app/Http/Controllers/BankAccountController.php:86
 * @route '/bank-accounts/{bankAccount}'
 */
const destroyForm = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\BankAccountController::destroy
 * @see app/Http/Controllers/BankAccountController.php:86
 * @route '/bank-accounts/{bankAccount}'
 */
destroyForm.delete = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;
/**
 * @see \App\Http\Controllers\BankAccountController::setPrimary
 * @see app/Http/Controllers/BankAccountController.php:110
 * @route '/bank-accounts/{bankAccount}/set-primary'
 */
export const setPrimary = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: setPrimary.url(args, options),
    method: 'post',
});

setPrimary.definition = {
    methods: ['post'],
    url: '/bank-accounts/{bankAccount}/set-primary',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\BankAccountController::setPrimary
 * @see app/Http/Controllers/BankAccountController.php:110
 * @route '/bank-accounts/{bankAccount}/set-primary'
 */
setPrimary.url = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bankAccount: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { bankAccount: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            bankAccount: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        bankAccount:
            typeof args.bankAccount === 'object'
                ? args.bankAccount.id
                : args.bankAccount,
    };

    return (
        setPrimary.definition.url
            .replace('{bankAccount}', parsedArgs.bankAccount.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\BankAccountController::setPrimary
 * @see app/Http/Controllers/BankAccountController.php:110
 * @route '/bank-accounts/{bankAccount}/set-primary'
 */
setPrimary.post = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: setPrimary.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\BankAccountController::setPrimary
 * @see app/Http/Controllers/BankAccountController.php:110
 * @route '/bank-accounts/{bankAccount}/set-primary'
 */
const setPrimaryForm = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: setPrimary.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\BankAccountController::setPrimary
 * @see app/Http/Controllers/BankAccountController.php:110
 * @route '/bank-accounts/{bankAccount}/set-primary'
 */
setPrimaryForm.post = (
    args:
        | { bankAccount: number | { id: number } }
        | [bankAccount: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: setPrimary.url(args, options),
    method: 'post',
});

setPrimary.form = setPrimaryForm;
const BankAccountController = { index, store, update, destroy, setPrimary };

export default BankAccountController;
