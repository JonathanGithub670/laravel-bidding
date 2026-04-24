import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\AdminUserController::index
 * @see app/Http/Controllers/Admin/AdminUserController.php:18
 * @route '/admin/users/admins'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/admin/users/admins',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::index
 * @see app/Http/Controllers/Admin/AdminUserController.php:18
 * @route '/admin/users/admins'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::index
 * @see app/Http/Controllers/Admin/AdminUserController.php:18
 * @route '/admin/users/admins'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\Admin\AdminUserController::index
 * @see app/Http/Controllers/Admin/AdminUserController.php:18
 * @route '/admin/users/admins'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::index
 * @see app/Http/Controllers/Admin/AdminUserController.php:18
 * @route '/admin/users/admins'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::index
 * @see app/Http/Controllers/Admin/AdminUserController.php:18
 * @route '/admin/users/admins'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\Admin\AdminUserController::index
 * @see app/Http/Controllers/Admin/AdminUserController.php:18
 * @route '/admin/users/admins'
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
 * @see \App\Http\Controllers\Admin\AdminUserController::store
 * @see app/Http/Controllers/Admin/AdminUserController.php:46
 * @route '/admin/users/admins'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/admin/users/admins',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::store
 * @see app/Http/Controllers/Admin/AdminUserController.php:46
 * @route '/admin/users/admins'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::store
 * @see app/Http/Controllers/Admin/AdminUserController.php:46
 * @route '/admin/users/admins'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::store
 * @see app/Http/Controllers/Admin/AdminUserController.php:46
 * @route '/admin/users/admins'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::store
 * @see app/Http/Controllers/Admin/AdminUserController.php:46
 * @route '/admin/users/admins'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;
/**
 * @see \App\Http\Controllers\Admin\AdminUserController::destroy
 * @see app/Http/Controllers/Admin/AdminUserController.php:77
 * @route '/admin/users/admins/{user}'
 */
export const destroy = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/admin/users/admins/{user}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::destroy
 * @see app/Http/Controllers/Admin/AdminUserController.php:77
 * @route '/admin/users/admins/{user}'
 */
destroy.url = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        user: typeof args.user === 'object' ? args.user.id : args.user,
    };

    return (
        destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::destroy
 * @see app/Http/Controllers/Admin/AdminUserController.php:77
 * @route '/admin/users/admins/{user}'
 */
destroy.delete = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::destroy
 * @see app/Http/Controllers/Admin/AdminUserController.php:77
 * @route '/admin/users/admins/{user}'
 */
const destroyForm = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
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
 * @see \App\Http\Controllers\Admin\AdminUserController::destroy
 * @see app/Http/Controllers/Admin/AdminUserController.php:77
 * @route '/admin/users/admins/{user}'
 */
destroyForm.delete = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
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
 * @see \App\Http\Controllers\Admin\AdminUserController::resetPassword
 * @see app/Http/Controllers/Admin/AdminUserController.php:93
 * @route '/admin/users/admins/{user}/reset-password'
 */
export const resetPassword = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
});

resetPassword.definition = {
    methods: ['post'],
    url: '/admin/users/admins/{user}/reset-password',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::resetPassword
 * @see app/Http/Controllers/Admin/AdminUserController.php:93
 * @route '/admin/users/admins/{user}/reset-password'
 */
resetPassword.url = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        user: typeof args.user === 'object' ? args.user.id : args.user,
    };

    return (
        resetPassword.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::resetPassword
 * @see app/Http/Controllers/Admin/AdminUserController.php:93
 * @route '/admin/users/admins/{user}/reset-password'
 */
resetPassword.post = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: resetPassword.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::resetPassword
 * @see app/Http/Controllers/Admin/AdminUserController.php:93
 * @route '/admin/users/admins/{user}/reset-password'
 */
const resetPasswordForm = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: resetPassword.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\AdminUserController::resetPassword
 * @see app/Http/Controllers/Admin/AdminUserController.php:93
 * @route '/admin/users/admins/{user}/reset-password'
 */
resetPasswordForm.post = (
    args:
        | { user: number | { id: number } }
        | [user: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: resetPassword.url(args, options),
    method: 'post',
});

resetPassword.form = resetPasswordForm;
const AdminUserController = { index, store, destroy, resetPassword };

export default AdminUserController;
