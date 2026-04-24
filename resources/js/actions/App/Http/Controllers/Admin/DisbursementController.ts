import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DisbursementController::index
 * @see app/Http/Controllers/Admin/DisbursementController.php:22
 * @route '/admin/disbursements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/disbursements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DisbursementController::index
 * @see app/Http/Controllers/Admin/DisbursementController.php:22
 * @route '/admin/disbursements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DisbursementController::index
 * @see app/Http/Controllers/Admin/DisbursementController.php:22
 * @route '/admin/disbursements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DisbursementController::index
 * @see app/Http/Controllers/Admin/DisbursementController.php:22
 * @route '/admin/disbursements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DisbursementController::index
 * @see app/Http/Controllers/Admin/DisbursementController.php:22
 * @route '/admin/disbursements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DisbursementController::index
 * @see app/Http/Controllers/Admin/DisbursementController.php:22
 * @route '/admin/disbursements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DisbursementController::index
 * @see app/Http/Controllers/Admin/DisbursementController.php:22
 * @route '/admin/disbursements'
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
* @see \App\Http\Controllers\Admin\DisbursementController::show
 * @see app/Http/Controllers/Admin/DisbursementController.php:56
 * @route '/admin/disbursements/{disbursement}'
 */
export const show = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/disbursements/{disbursement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DisbursementController::show
 * @see app/Http/Controllers/Admin/DisbursementController.php:56
 * @route '/admin/disbursements/{disbursement}'
 */
show.url = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { disbursement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { disbursement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    disbursement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        disbursement: typeof args.disbursement === 'object'
                ? args.disbursement.id
                : args.disbursement,
                }

    return show.definition.url
            .replace('{disbursement}', parsedArgs.disbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DisbursementController::show
 * @see app/Http/Controllers/Admin/DisbursementController.php:56
 * @route '/admin/disbursements/{disbursement}'
 */
show.get = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DisbursementController::show
 * @see app/Http/Controllers/Admin/DisbursementController.php:56
 * @route '/admin/disbursements/{disbursement}'
 */
show.head = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DisbursementController::show
 * @see app/Http/Controllers/Admin/DisbursementController.php:56
 * @route '/admin/disbursements/{disbursement}'
 */
    const showForm = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DisbursementController::show
 * @see app/Http/Controllers/Admin/DisbursementController.php:56
 * @route '/admin/disbursements/{disbursement}'
 */
        showForm.get = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DisbursementController::show
 * @see app/Http/Controllers/Admin/DisbursementController.php:56
 * @route '/admin/disbursements/{disbursement}'
 */
        showForm.head = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\DisbursementController::approve
 * @see app/Http/Controllers/Admin/DisbursementController.php:68
 * @route '/admin/disbursements/{disbursement}/approve'
 */
export const approve = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/disbursements/{disbursement}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DisbursementController::approve
 * @see app/Http/Controllers/Admin/DisbursementController.php:68
 * @route '/admin/disbursements/{disbursement}/approve'
 */
approve.url = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { disbursement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { disbursement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    disbursement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        disbursement: typeof args.disbursement === 'object'
                ? args.disbursement.id
                : args.disbursement,
                }

    return approve.definition.url
            .replace('{disbursement}', parsedArgs.disbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DisbursementController::approve
 * @see app/Http/Controllers/Admin/DisbursementController.php:68
 * @route '/admin/disbursements/{disbursement}/approve'
 */
approve.post = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\DisbursementController::approve
 * @see app/Http/Controllers/Admin/DisbursementController.php:68
 * @route '/admin/disbursements/{disbursement}/approve'
 */
    const approveForm = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DisbursementController::approve
 * @see app/Http/Controllers/Admin/DisbursementController.php:68
 * @route '/admin/disbursements/{disbursement}/approve'
 */
        approveForm.post = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\DisbursementController::reject
 * @see app/Http/Controllers/Admin/DisbursementController.php:81
 * @route '/admin/disbursements/{disbursement}/reject'
 */
export const reject = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/disbursements/{disbursement}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DisbursementController::reject
 * @see app/Http/Controllers/Admin/DisbursementController.php:81
 * @route '/admin/disbursements/{disbursement}/reject'
 */
reject.url = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { disbursement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { disbursement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    disbursement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        disbursement: typeof args.disbursement === 'object'
                ? args.disbursement.id
                : args.disbursement,
                }

    return reject.definition.url
            .replace('{disbursement}', parsedArgs.disbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DisbursementController::reject
 * @see app/Http/Controllers/Admin/DisbursementController.php:81
 * @route '/admin/disbursements/{disbursement}/reject'
 */
reject.post = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\DisbursementController::reject
 * @see app/Http/Controllers/Admin/DisbursementController.php:81
 * @route '/admin/disbursements/{disbursement}/reject'
 */
    const rejectForm = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\DisbursementController::reject
 * @see app/Http/Controllers/Admin/DisbursementController.php:81
 * @route '/admin/disbursements/{disbursement}/reject'
 */
        rejectForm.post = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const DisbursementController = { index, show, approve, reject }

export default DisbursementController