import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
 */
export const show = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/auctions/{auction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
* @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
 */
show.get = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
 */
show.head = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
 */
    const showForm = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
 */
        showForm.get = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuctionController::show
 * @see app/Http/Controllers/AuctionController.php:31
 * @route '/auctions/{auction}'
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
* @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/auctions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuctionController::create
 * @see app/Http/Controllers/AuctionController.php:273
 * @route '/auctions/create'
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
* @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/auctions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuctionController::store
 * @see app/Http/Controllers/AuctionController.php:285
 * @route '/auctions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AuctionController::placeBid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
export const placeBid = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: placeBid.url(args, options),
    method: 'post',
})

placeBid.definition = {
    methods: ["post"],
    url: '/auctions/{auction}/bid',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuctionController::placeBid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
placeBid.url = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return placeBid.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuctionController::placeBid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
placeBid.post = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: placeBid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuctionController::placeBid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
    const placeBidForm = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: placeBid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuctionController::placeBid
 * @see app/Http/Controllers/AuctionController.php:126
 * @route '/auctions/{auction}/bid'
 */
        placeBidForm.post = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: placeBid.url(args, options),
            method: 'post',
        })
    
    placeBid.form = placeBidForm
/**
* @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
export const register = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(args, options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/auctions/{auction}/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
register.url = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return register.definition.url
            .replace('{auction}', parsedArgs.auction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
register.post = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
    const registerForm = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: register.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuctionController::register
 * @see app/Http/Controllers/AuctionController.php:169
 * @route '/auctions/{auction}/register'
 */
        registerForm.post = (args: { auction: string | { uuid: string } } | [auction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url(args, options),
            method: 'post',
        })
    
    register.form = registerForm
const AuctionController = { show, create, store, placeBid, register }

export default AuctionController