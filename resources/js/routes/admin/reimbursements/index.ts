import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ReimbursementController::index
 * @see app/Http/Controllers/Admin/ReimbursementController.php:22
 * @route '/admin/reimbursements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/reimbursements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReimbursementController::index
 * @see app/Http/Controllers/Admin/ReimbursementController.php:22
 * @route '/admin/reimbursements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReimbursementController::index
 * @see app/Http/Controllers/Admin/ReimbursementController.php:22
 * @route '/admin/reimbursements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ReimbursementController::index
 * @see app/Http/Controllers/Admin/ReimbursementController.php:22
 * @route '/admin/reimbursements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ReimbursementController::index
 * @see app/Http/Controllers/Admin/ReimbursementController.php:22
 * @route '/admin/reimbursements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ReimbursementController::index
 * @see app/Http/Controllers/Admin/ReimbursementController.php:22
 * @route '/admin/reimbursements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ReimbursementController::index
 * @see app/Http/Controllers/Admin/ReimbursementController.php:22
 * @route '/admin/reimbursements'
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
* @see \App\Http\Controllers\Admin\ReimbursementController::approve
 * @see app/Http/Controllers/Admin/ReimbursementController.php:57
 * @route '/admin/reimbursements/{reimbursement}/approve'
 */
export const approve = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/reimbursements/{reimbursement}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReimbursementController::approve
 * @see app/Http/Controllers/Admin/ReimbursementController.php:57
 * @route '/admin/reimbursements/{reimbursement}/approve'
 */
approve.url = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reimbursement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reimbursement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reimbursement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reimbursement: typeof args.reimbursement === 'object'
                ? args.reimbursement.id
                : args.reimbursement,
                }

    return approve.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReimbursementController::approve
 * @see app/Http/Controllers/Admin/ReimbursementController.php:57
 * @route '/admin/reimbursements/{reimbursement}/approve'
 */
approve.post = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ReimbursementController::approve
 * @see app/Http/Controllers/Admin/ReimbursementController.php:57
 * @route '/admin/reimbursements/{reimbursement}/approve'
 */
    const approveForm = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ReimbursementController::approve
 * @see app/Http/Controllers/Admin/ReimbursementController.php:57
 * @route '/admin/reimbursements/{reimbursement}/approve'
 */
        approveForm.post = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\ReimbursementController::reject
 * @see app/Http/Controllers/Admin/ReimbursementController.php:70
 * @route '/admin/reimbursements/{reimbursement}/reject'
 */
export const reject = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/reimbursements/{reimbursement}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReimbursementController::reject
 * @see app/Http/Controllers/Admin/ReimbursementController.php:70
 * @route '/admin/reimbursements/{reimbursement}/reject'
 */
reject.url = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reimbursement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reimbursement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reimbursement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reimbursement: typeof args.reimbursement === 'object'
                ? args.reimbursement.id
                : args.reimbursement,
                }

    return reject.definition.url
            .replace('{reimbursement}', parsedArgs.reimbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReimbursementController::reject
 * @see app/Http/Controllers/Admin/ReimbursementController.php:70
 * @route '/admin/reimbursements/{reimbursement}/reject'
 */
reject.post = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ReimbursementController::reject
 * @see app/Http/Controllers/Admin/ReimbursementController.php:70
 * @route '/admin/reimbursements/{reimbursement}/reject'
 */
    const rejectForm = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ReimbursementController::reject
 * @see app/Http/Controllers/Admin/ReimbursementController.php:70
 * @route '/admin/reimbursements/{reimbursement}/reject'
 */
        rejectForm.post = (args: { reimbursement: number | { id: number } } | [reimbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const reimbursements = {
    index: Object.assign(index, index),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
}

export default reimbursements