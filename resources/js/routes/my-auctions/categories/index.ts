import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../wayfinder';
/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/my-auctions/categories',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\MyAuctionController::store
 * @see app/Http/Controllers/MyAuctionController.php:208
 * @route '/my-auctions/categories'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;
const categories = {
    store: Object.assign(store, store),
};

export default categories;
