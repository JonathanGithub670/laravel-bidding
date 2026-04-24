import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SellerSettlementController::index
 * @see app/Http/Controllers/SellerSettlementController.php:16
 * @route '/my-auctions/settlements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/my-auctions/settlements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SellerSettlementController::index
 * @see app/Http/Controllers/SellerSettlementController.php:16
 * @route '/my-auctions/settlements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerSettlementController::index
 * @see app/Http/Controllers/SellerSettlementController.php:16
 * @route '/my-auctions/settlements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SellerSettlementController::index
 * @see app/Http/Controllers/SellerSettlementController.php:16
 * @route '/my-auctions/settlements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SellerSettlementController::index
 * @see app/Http/Controllers/SellerSettlementController.php:16
 * @route '/my-auctions/settlements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SellerSettlementController::index
 * @see app/Http/Controllers/SellerSettlementController.php:16
 * @route '/my-auctions/settlements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SellerSettlementController::index
 * @see app/Http/Controllers/SellerSettlementController.php:16
 * @route '/my-auctions/settlements'
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
* @see \App\Http\Controllers\SellerSettlementController::confirmShipping
 * @see app/Http/Controllers/SellerSettlementController.php:49
 * @route '/my-auctions/settlements/{settlement}/confirm-shipping'
 */
export const confirmShipping = (args: { settlement: number | { id: number } } | [settlement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmShipping.url(args, options),
    method: 'post',
})

confirmShipping.definition = {
    methods: ["post"],
    url: '/my-auctions/settlements/{settlement}/confirm-shipping',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SellerSettlementController::confirmShipping
 * @see app/Http/Controllers/SellerSettlementController.php:49
 * @route '/my-auctions/settlements/{settlement}/confirm-shipping'
 */
confirmShipping.url = (args: { settlement: number | { id: number } } | [settlement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { settlement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { settlement: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    settlement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        settlement: typeof args.settlement === 'object'
                ? args.settlement.id
                : args.settlement,
                }

    return confirmShipping.definition.url
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SellerSettlementController::confirmShipping
 * @see app/Http/Controllers/SellerSettlementController.php:49
 * @route '/my-auctions/settlements/{settlement}/confirm-shipping'
 */
confirmShipping.post = (args: { settlement: number | { id: number } } | [settlement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmShipping.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\SellerSettlementController::confirmShipping
 * @see app/Http/Controllers/SellerSettlementController.php:49
 * @route '/my-auctions/settlements/{settlement}/confirm-shipping'
 */
    const confirmShippingForm = (args: { settlement: number | { id: number } } | [settlement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmShipping.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\SellerSettlementController::confirmShipping
 * @see app/Http/Controllers/SellerSettlementController.php:49
 * @route '/my-auctions/settlements/{settlement}/confirm-shipping'
 */
        confirmShippingForm.post = (args: { settlement: number | { id: number } } | [settlement: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmShipping.url(args, options),
            method: 'post',
        })
    
    confirmShipping.form = confirmShippingForm
const settlements = {
    index: Object.assign(index, index),
confirmShipping: Object.assign(confirmShipping, confirmShipping),
}

export default settlements