import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\UserInvoiceController::index
 * @see app/Http/Controllers/UserInvoiceController.php:17
 * @route '/user/invoices'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/user/invoices',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserInvoiceController::index
 * @see app/Http/Controllers/UserInvoiceController.php:17
 * @route '/user/invoices'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserInvoiceController::index
 * @see app/Http/Controllers/UserInvoiceController.php:17
 * @route '/user/invoices'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserInvoiceController::index
 * @see app/Http/Controllers/UserInvoiceController.php:17
 * @route '/user/invoices'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserInvoiceController::index
 * @see app/Http/Controllers/UserInvoiceController.php:17
 * @route '/user/invoices'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserInvoiceController::index
 * @see app/Http/Controllers/UserInvoiceController.php:17
 * @route '/user/invoices'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserInvoiceController::index
 * @see app/Http/Controllers/UserInvoiceController.php:17
 * @route '/user/invoices'
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
* @see \App\Http\Controllers\UserInvoiceController::show
 * @see app/Http/Controllers/UserInvoiceController.php:112
 * @route '/user/invoices/{type}/{uuid}'
 */
export const show = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/user/invoices/{type}/{uuid}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserInvoiceController::show
 * @see app/Http/Controllers/UserInvoiceController.php:112
 * @route '/user/invoices/{type}/{uuid}'
 */
show.url = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    type: args[0],
                    uuid: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        type: args.type,
                                uuid: args.uuid,
                }

    return show.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace('{uuid}', parsedArgs.uuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserInvoiceController::show
 * @see app/Http/Controllers/UserInvoiceController.php:112
 * @route '/user/invoices/{type}/{uuid}'
 */
show.get = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserInvoiceController::show
 * @see app/Http/Controllers/UserInvoiceController.php:112
 * @route '/user/invoices/{type}/{uuid}'
 */
show.head = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserInvoiceController::show
 * @see app/Http/Controllers/UserInvoiceController.php:112
 * @route '/user/invoices/{type}/{uuid}'
 */
    const showForm = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserInvoiceController::show
 * @see app/Http/Controllers/UserInvoiceController.php:112
 * @route '/user/invoices/{type}/{uuid}'
 */
        showForm.get = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserInvoiceController::show
 * @see app/Http/Controllers/UserInvoiceController.php:112
 * @route '/user/invoices/{type}/{uuid}'
 */
        showForm.head = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\UserInvoiceController::download
 * @see app/Http/Controllers/UserInvoiceController.php:208
 * @route '/user/invoices/{type}/{uuid}/download'
 */
export const download = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/user/invoices/{type}/{uuid}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserInvoiceController::download
 * @see app/Http/Controllers/UserInvoiceController.php:208
 * @route '/user/invoices/{type}/{uuid}/download'
 */
download.url = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    type: args[0],
                    uuid: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        type: args.type,
                                uuid: args.uuid,
                }

    return download.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace('{uuid}', parsedArgs.uuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserInvoiceController::download
 * @see app/Http/Controllers/UserInvoiceController.php:208
 * @route '/user/invoices/{type}/{uuid}/download'
 */
download.get = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserInvoiceController::download
 * @see app/Http/Controllers/UserInvoiceController.php:208
 * @route '/user/invoices/{type}/{uuid}/download'
 */
download.head = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserInvoiceController::download
 * @see app/Http/Controllers/UserInvoiceController.php:208
 * @route '/user/invoices/{type}/{uuid}/download'
 */
    const downloadForm = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserInvoiceController::download
 * @see app/Http/Controllers/UserInvoiceController.php:208
 * @route '/user/invoices/{type}/{uuid}/download'
 */
        downloadForm.get = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserInvoiceController::download
 * @see app/Http/Controllers/UserInvoiceController.php:208
 * @route '/user/invoices/{type}/{uuid}/download'
 */
        downloadForm.head = (args: { type: string | number, uuid: string | number } | [type: string | number, uuid: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const invoices = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
download: Object.assign(download, download),
}

export default invoices