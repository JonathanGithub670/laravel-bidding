import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DisbursementController::index
 * @see app/Http/Controllers/DisbursementController.php:22
 * @route '/disbursements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/disbursements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DisbursementController::index
 * @see app/Http/Controllers/DisbursementController.php:22
 * @route '/disbursements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DisbursementController::index
 * @see app/Http/Controllers/DisbursementController.php:22
 * @route '/disbursements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DisbursementController::index
 * @see app/Http/Controllers/DisbursementController.php:22
 * @route '/disbursements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DisbursementController::index
 * @see app/Http/Controllers/DisbursementController.php:22
 * @route '/disbursements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DisbursementController::index
 * @see app/Http/Controllers/DisbursementController.php:22
 * @route '/disbursements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DisbursementController::index
 * @see app/Http/Controllers/DisbursementController.php:22
 * @route '/disbursements'
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
* @see \App\Http\Controllers\DisbursementController::create
 * @see app/Http/Controllers/DisbursementController.php:37
 * @route '/disbursements/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/disbursements/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DisbursementController::create
 * @see app/Http/Controllers/DisbursementController.php:37
 * @route '/disbursements/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DisbursementController::create
 * @see app/Http/Controllers/DisbursementController.php:37
 * @route '/disbursements/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DisbursementController::create
 * @see app/Http/Controllers/DisbursementController.php:37
 * @route '/disbursements/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DisbursementController::create
 * @see app/Http/Controllers/DisbursementController.php:37
 * @route '/disbursements/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DisbursementController::create
 * @see app/Http/Controllers/DisbursementController.php:37
 * @route '/disbursements/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DisbursementController::create
 * @see app/Http/Controllers/DisbursementController.php:37
 * @route '/disbursements/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\DisbursementController::store
 * @see app/Http/Controllers/DisbursementController.php:57
 * @route '/disbursements'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/disbursements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DisbursementController::store
 * @see app/Http/Controllers/DisbursementController.php:57
 * @route '/disbursements'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DisbursementController::store
 * @see app/Http/Controllers/DisbursementController.php:57
 * @route '/disbursements'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DisbursementController::store
 * @see app/Http/Controllers/DisbursementController.php:57
 * @route '/disbursements'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DisbursementController::store
 * @see app/Http/Controllers/DisbursementController.php:57
 * @route '/disbursements'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DisbursementController::show
 * @see app/Http/Controllers/DisbursementController.php:85
 * @route '/disbursements/{disbursement}'
 */
export const show = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/disbursements/{disbursement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DisbursementController::show
 * @see app/Http/Controllers/DisbursementController.php:85
 * @route '/disbursements/{disbursement}'
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
* @see \App\Http\Controllers\DisbursementController::show
 * @see app/Http/Controllers/DisbursementController.php:85
 * @route '/disbursements/{disbursement}'
 */
show.get = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DisbursementController::show
 * @see app/Http/Controllers/DisbursementController.php:85
 * @route '/disbursements/{disbursement}'
 */
show.head = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DisbursementController::show
 * @see app/Http/Controllers/DisbursementController.php:85
 * @route '/disbursements/{disbursement}'
 */
    const showForm = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DisbursementController::show
 * @see app/Http/Controllers/DisbursementController.php:85
 * @route '/disbursements/{disbursement}'
 */
        showForm.get = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DisbursementController::show
 * @see app/Http/Controllers/DisbursementController.php:85
 * @route '/disbursements/{disbursement}'
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
* @see \App\Http\Controllers\DisbursementController::cancel
 * @see app/Http/Controllers/DisbursementController.php:102
 * @route '/disbursements/{disbursement}/cancel'
 */
export const cancel = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/disbursements/{disbursement}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DisbursementController::cancel
 * @see app/Http/Controllers/DisbursementController.php:102
 * @route '/disbursements/{disbursement}/cancel'
 */
cancel.url = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancel.definition.url
            .replace('{disbursement}', parsedArgs.disbursement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DisbursementController::cancel
 * @see app/Http/Controllers/DisbursementController.php:102
 * @route '/disbursements/{disbursement}/cancel'
 */
cancel.post = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DisbursementController::cancel
 * @see app/Http/Controllers/DisbursementController.php:102
 * @route '/disbursements/{disbursement}/cancel'
 */
    const cancelForm = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DisbursementController::cancel
 * @see app/Http/Controllers/DisbursementController.php:102
 * @route '/disbursements/{disbursement}/cancel'
 */
        cancelForm.post = (args: { disbursement: number | { id: number } } | [disbursement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\DisbursementController::feePreview
 * @see app/Http/Controllers/DisbursementController.php:115
 * @route '/disbursements/fee-preview'
 */
export const feePreview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feePreview.url(options),
    method: 'post',
})

feePreview.definition = {
    methods: ["post"],
    url: '/disbursements/fee-preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DisbursementController::feePreview
 * @see app/Http/Controllers/DisbursementController.php:115
 * @route '/disbursements/fee-preview'
 */
feePreview.url = (options?: RouteQueryOptions) => {
    return feePreview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DisbursementController::feePreview
 * @see app/Http/Controllers/DisbursementController.php:115
 * @route '/disbursements/fee-preview'
 */
feePreview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: feePreview.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DisbursementController::feePreview
 * @see app/Http/Controllers/DisbursementController.php:115
 * @route '/disbursements/fee-preview'
 */
    const feePreviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: feePreview.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DisbursementController::feePreview
 * @see app/Http/Controllers/DisbursementController.php:115
 * @route '/disbursements/fee-preview'
 */
        feePreviewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: feePreview.url(options),
            method: 'post',
        })
    
    feePreview.form = feePreviewForm
const DisbursementController = { index, create, store, show, cancel, feePreview }

export default DisbursementController