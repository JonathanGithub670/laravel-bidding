import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuctionListController::index
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/auctions/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuctionListController::index
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuctionListController::index
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuctionListController::index
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuctionListController::index
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuctionListController::index
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuctionListController::index
 * @see app/Http/Controllers/AuctionListController.php:18
 * @route '/auctions/list'
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
const AuctionListController = { index }

export default AuctionListController