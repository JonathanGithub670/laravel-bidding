import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::index
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:17
 * @route '/admin/auctions/pending'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/auctions/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::index
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:17
 * @route '/admin/auctions/pending'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::index
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:17
 * @route '/admin/auctions/pending'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::index
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:17
 * @route '/admin/auctions/pending'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::index
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:17
 * @route '/admin/auctions/pending'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::index
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:17
 * @route '/admin/auctions/pending'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::index
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:17
 * @route '/admin/auctions/pending'
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
* @see \App\Http\Controllers\Admin\AuctionApprovalController::history
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:37
 * @route '/admin/auctions/history'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/admin/auctions/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::history
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:37
 * @route '/admin/auctions/history'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::history
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:37
 * @route '/admin/auctions/history'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::history
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:37
 * @route '/admin/auctions/history'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::history
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:37
 * @route '/admin/auctions/history'
 */
    const historyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: history.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::history
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:37
 * @route '/admin/auctions/history'
 */
        historyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::history
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:37
 * @route '/admin/auctions/history'
 */
        historyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: history.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    history.form = historyForm
/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::show
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:61
 * @route '/admin/auctions/{auction}/review'
 */
export const show = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/auctions/{auction}/review',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::show
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:61
 * @route '/admin/auctions/{auction}/review'
 */
show.url = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { auction: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    auction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        auction: typeof args.auction === 'object'
                ? args.auction.uuid
                : args.auction,
                }

    return show.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::show
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:61
 * @route '/admin/auctions/{auction}/review'
 */
show.get = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::show
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:61
 * @route '/admin/auctions/{auction}/review'
 */
show.head = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::show
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:61
 * @route '/admin/auctions/{auction}/review'
 */
    const showForm = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::show
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:61
 * @route '/admin/auctions/{auction}/review'
 */
        showForm.get = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::show
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:61
 * @route '/admin/auctions/{auction}/review'
 */
        showForm.head = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AuctionApprovalController::approve
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:80
 * @route '/admin/auctions/{auction}/approve'
 */
export const approve = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/auctions/{auction}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::approve
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:80
 * @route '/admin/auctions/{auction}/approve'
 */
approve.url = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { auction: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    auction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        auction: typeof args.auction === 'object'
                ? args.auction.uuid
                : args.auction,
                }

    return approve.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::approve
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:80
 * @route '/admin/auctions/{auction}/approve'
 */
approve.post = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::approve
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:80
 * @route '/admin/auctions/{auction}/approve'
 */
    const approveForm = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::approve
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:80
 * @route '/admin/auctions/{auction}/approve'
 */
        approveForm.post = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::reject
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:117
 * @route '/admin/auctions/{auction}/reject'
 */
export const reject = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/auctions/{auction}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::reject
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:117
 * @route '/admin/auctions/{auction}/reject'
 */
reject.url = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
            args = { auction: args.uuid }
        }
    
    if (Array.isArray(args)) {
        args = {
                    auction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        auction: typeof args.auction === 'object'
                ? args.auction.uuid
                : args.auction,
                }

    return reject.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::reject
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:117
 * @route '/admin/auctions/{auction}/reject'
 */
reject.post = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::reject
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:117
 * @route '/admin/auctions/{auction}/reject'
 */
    const rejectForm = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AuctionApprovalController::reject
 * @see app/Http/Controllers/Admin/AuctionApprovalController.php:117
 * @route '/admin/auctions/{auction}/reject'
 */
        rejectForm.post = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const AuctionApprovalController = { index, history, show, approve, reject }

export default AuctionApprovalController