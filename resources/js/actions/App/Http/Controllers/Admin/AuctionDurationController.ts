import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::index
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:13
 * @route '/admin/durations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/durations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::index
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:13
 * @route '/admin/durations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::index
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:13
 * @route '/admin/durations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::index
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:13
 * @route '/admin/durations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AuctionDurationController::index
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:13
 * @route '/admin/durations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AuctionDurationController::index
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:13
 * @route '/admin/durations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AuctionDurationController::index
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:13
 * @route '/admin/durations'
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
* @see \App\Http\Controllers\Admin\AuctionDurationController::store
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:22
 * @route '/admin/durations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/durations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::store
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:22
 * @route '/admin/durations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::store
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:22
 * @route '/admin/durations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AuctionDurationController::store
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:22
 * @route '/admin/durations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AuctionDurationController::store
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:22
 * @route '/admin/durations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::destroy
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:43
 * @route '/admin/durations/{duration}'
 */
export const destroy = (args: { duration: number | { id: number } } | [duration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/durations/{duration}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::destroy
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:43
 * @route '/admin/durations/{duration}'
 */
destroy.url = (args: { duration: number | { id: number } } | [duration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { duration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { duration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    duration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        duration: typeof args.duration === 'object'
                ? args.duration.id
                : args.duration,
                }

    return destroy.definition.url
            .replace('{duration}', parsedArgs.duration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuctionDurationController::destroy
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:43
 * @route '/admin/durations/{duration}'
 */
destroy.delete = (args: { duration: number | { id: number } } | [duration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AuctionDurationController::destroy
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:43
 * @route '/admin/durations/{duration}'
 */
    const destroyForm = (args: { duration: number | { id: number } } | [duration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AuctionDurationController::destroy
 * @see app/Http/Controllers/Admin/AuctionDurationController.php:43
 * @route '/admin/durations/{duration}'
 */
        destroyForm.delete = (args: { duration: number | { id: number } } | [duration: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AuctionDurationController = { index, store, destroy }

export default AuctionDurationController