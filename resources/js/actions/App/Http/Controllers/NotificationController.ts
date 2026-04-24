import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/notifications',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:13
 * @route '/notifications'
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
/**
 * @see \App\Http\Controllers\NotificationController::markAllRead
 * @see app/Http/Controllers/NotificationController.php:39
 * @route '/notifications/mark-all-read'
 */
export const markAllRead = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
});

markAllRead.definition = {
    methods: ['post'],
    url: '/notifications/mark-all-read',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NotificationController::markAllRead
 * @see app/Http/Controllers/NotificationController.php:39
 * @route '/notifications/mark-all-read'
 */
markAllRead.url = (options?: RouteQueryOptions) => {
    return markAllRead.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\NotificationController::markAllRead
 * @see app/Http/Controllers/NotificationController.php:39
 * @route '/notifications/mark-all-read'
 */
markAllRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllRead.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NotificationController::markAllRead
 * @see app/Http/Controllers/NotificationController.php:39
 * @route '/notifications/mark-all-read'
 */
const markAllReadForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markAllRead.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NotificationController::markAllRead
 * @see app/Http/Controllers/NotificationController.php:39
 * @route '/notifications/mark-all-read'
 */
markAllReadForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markAllRead.url(options),
    method: 'post',
});

markAllRead.form = markAllReadForm;
/**
 * @see \App\Http\Controllers\NotificationController::markRead
 * @see app/Http/Controllers/NotificationController.php:49
 * @route '/notifications/{id}/mark-read'
 */
export const markRead = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: markRead.url(args, options),
    method: 'post',
});

markRead.definition = {
    methods: ['post'],
    url: '/notifications/{id}/mark-read',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\NotificationController::markRead
 * @see app/Http/Controllers/NotificationController.php:49
 * @route '/notifications/{id}/mark-read'
 */
markRead.url = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args };
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        id: args.id,
    };

    return (
        markRead.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\NotificationController::markRead
 * @see app/Http/Controllers/NotificationController.php:49
 * @route '/notifications/{id}/mark-read'
 */
markRead.post = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: markRead.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NotificationController::markRead
 * @see app/Http/Controllers/NotificationController.php:49
 * @route '/notifications/{id}/mark-read'
 */
const markReadForm = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markRead.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\NotificationController::markRead
 * @see app/Http/Controllers/NotificationController.php:49
 * @route '/notifications/{id}/mark-read'
 */
markReadForm.post = (
    args: { id: string | number } | [id: string | number] | string | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: markRead.url(args, options),
    method: 'post',
});

markRead.form = markReadForm;
const NotificationController = { index, markAllRead, markRead };

export default NotificationController;
