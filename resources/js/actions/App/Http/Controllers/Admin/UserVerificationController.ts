import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserVerificationController::index
 * @see app/Http/Controllers/Admin/UserVerificationController.php:17
 * @route '/admin/users/verification'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/users/verification',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\UserVerificationController::index
 * @see app/Http/Controllers/Admin/UserVerificationController.php:17
 * @route '/admin/users/verification'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserVerificationController::index
 * @see app/Http/Controllers/Admin/UserVerificationController.php:17
 * @route '/admin/users/verification'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\UserVerificationController::index
 * @see app/Http/Controllers/Admin/UserVerificationController.php:17
 * @route '/admin/users/verification'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\UserVerificationController::index
 * @see app/Http/Controllers/Admin/UserVerificationController.php:17
 * @route '/admin/users/verification'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\UserVerificationController::index
 * @see app/Http/Controllers/Admin/UserVerificationController.php:17
 * @route '/admin/users/verification'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\UserVerificationController::index
 * @see app/Http/Controllers/Admin/UserVerificationController.php:17
 * @route '/admin/users/verification'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\UserVerificationController::approve
 * @see app/Http/Controllers/Admin/UserVerificationController.php:48
 * @route '/admin/users/{user}/approve'
 */
export const approve = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserVerificationController::approve
 * @see app/Http/Controllers/Admin/UserVerificationController.php:48
 * @route '/admin/users/{user}/approve'
 */
approve.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return approve.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserVerificationController::approve
 * @see app/Http/Controllers/Admin/UserVerificationController.php:48
 * @route '/admin/users/{user}/approve'
 */
approve.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserVerificationController::approve
 * @see app/Http/Controllers/Admin/UserVerificationController.php:48
 * @route '/admin/users/{user}/approve'
 */
    const approveForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserVerificationController::approve
 * @see app/Http/Controllers/Admin/UserVerificationController.php:48
 * @route '/admin/users/{user}/approve'
 */
        approveForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\UserVerificationController::reject
 * @see app/Http/Controllers/Admin/UserVerificationController.php:67
 * @route '/admin/users/{user}/reject'
 */
export const reject = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/users/{user}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\UserVerificationController::reject
 * @see app/Http/Controllers/Admin/UserVerificationController.php:67
 * @route '/admin/users/{user}/reject'
 */
reject.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return reject.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserVerificationController::reject
 * @see app/Http/Controllers/Admin/UserVerificationController.php:67
 * @route '/admin/users/{user}/reject'
 */
reject.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\UserVerificationController::reject
 * @see app/Http/Controllers/Admin/UserVerificationController.php:67
 * @route '/admin/users/{user}/reject'
 */
    const rejectForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\UserVerificationController::reject
 * @see app/Http/Controllers/Admin/UserVerificationController.php:67
 * @route '/admin/users/{user}/reject'
 */
        rejectForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const UserVerificationController = { index, approve, reject }

export default UserVerificationController