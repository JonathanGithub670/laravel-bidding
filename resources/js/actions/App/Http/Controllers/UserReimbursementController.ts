import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\UserReimbursementController::index
 * @see app/Http/Controllers/UserReimbursementController.php:15
 * @route '/user/reimbursements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/user/reimbursements',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\UserReimbursementController::index
 * @see app/Http/Controllers/UserReimbursementController.php:15
 * @route '/user/reimbursements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\UserReimbursementController::index
 * @see app/Http/Controllers/UserReimbursementController.php:15
 * @route '/user/reimbursements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\UserReimbursementController::index
 * @see app/Http/Controllers/UserReimbursementController.php:15
 * @route '/user/reimbursements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\UserReimbursementController::index
 * @see app/Http/Controllers/UserReimbursementController.php:15
 * @route '/user/reimbursements'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\UserReimbursementController::index
 * @see app/Http/Controllers/UserReimbursementController.php:15
 * @route '/user/reimbursements'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\UserReimbursementController::index
 * @see app/Http/Controllers/UserReimbursementController.php:15
 * @route '/user/reimbursements'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;
const UserReimbursementController = { index };

export default UserReimbursementController;
