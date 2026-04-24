import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\ChatController::messages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
export const messages = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
});

messages.definition = {
    methods: ['get', 'head'],
    url: '/chat/{chat}/messages',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ChatController::messages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
messages.url = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { chat: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            chat: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        chat: typeof args.chat === 'object' ? args.chat.id : args.chat,
    };

    return (
        messages.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ChatController::messages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
messages.get = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: messages.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ChatController::messages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
messages.head = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: messages.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ChatController::messages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
const messagesForm = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ChatController::messages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
messagesForm.get = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: messages.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ChatController::messages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
messagesForm.head = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: messages.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

messages.form = messagesForm;
/**
 * @see \App\Http\Controllers\ChatController::send
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
export const send = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
});

send.definition = {
    methods: ['post'],
    url: '/chat/{chat}/messages',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ChatController::send
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
send.url = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { chat: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            chat: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        chat: typeof args.chat === 'object' ? args.chat.id : args.chat,
    };

    return (
        send.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ChatController::send
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
send.post = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::send
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
const sendForm = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: send.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::send
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
sendForm.post = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: send.url(args, options),
    method: 'post',
});

send.form = sendForm;
/**
 * @see \App\Http\Controllers\ChatController::create
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
});

create.definition = {
    methods: ['post'],
    url: '/chat/create',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ChatController::create
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ChatController::create
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::create
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: create.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::create
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
createForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: create.url(options),
    method: 'post',
});

create.form = createForm;
/**
 * @see \App\Http\Controllers\ChatController::searchByPin
 * @see app/Http/Controllers/ChatController.php:83
 * @route '/chat/search-by-pin'
 */
export const searchByPin = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: searchByPin.url(options),
    method: 'post',
});

searchByPin.definition = {
    methods: ['post'],
    url: '/chat/search-by-pin',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ChatController::searchByPin
 * @see app/Http/Controllers/ChatController.php:83
 * @route '/chat/search-by-pin'
 */
searchByPin.url = (options?: RouteQueryOptions) => {
    return searchByPin.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ChatController::searchByPin
 * @see app/Http/Controllers/ChatController.php:83
 * @route '/chat/search-by-pin'
 */
searchByPin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: searchByPin.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::searchByPin
 * @see app/Http/Controllers/ChatController.php:83
 * @route '/chat/search-by-pin'
 */
const searchByPinForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: searchByPin.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::searchByPin
 * @see app/Http/Controllers/ChatController.php:83
 * @route '/chat/search-by-pin'
 */
searchByPinForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: searchByPin.url(options),
    method: 'post',
});

searchByPin.form = searchByPinForm;
/**
 * @see \App\Http\Controllers\ChatController::startAdminChat
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/start-admin-chat'
 */
export const startAdminChat = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: startAdminChat.url(options),
    method: 'post',
});

startAdminChat.definition = {
    methods: ['post'],
    url: '/chat/start-admin-chat',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ChatController::startAdminChat
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/start-admin-chat'
 */
startAdminChat.url = (options?: RouteQueryOptions) => {
    return startAdminChat.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ChatController::startAdminChat
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/start-admin-chat'
 */
startAdminChat.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: startAdminChat.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::startAdminChat
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/start-admin-chat'
 */
const startAdminChatForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: startAdminChat.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::startAdminChat
 * @see app/Http/Controllers/ChatController.php:232
 * @route '/chat/start-admin-chat'
 */
startAdminChatForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: startAdminChat.url(options),
    method: 'post',
});

startAdminChat.form = startAdminChatForm;
/**
 * @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:287
 * @route '/chat/{chat}'
 */
export const destroy = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/chat/{chat}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:287
 * @route '/chat/{chat}'
 */
destroy.url = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chat: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { chat: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            chat: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        chat: typeof args.chat === 'object' ? args.chat.id : args.chat,
    };

    return (
        destroy.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:287
 * @route '/chat/{chat}'
 */
destroy.delete = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:287
 * @route '/chat/{chat}'
 */
const destroyForm = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::destroy
 * @see app/Http/Controllers/ChatController.php:287
 * @route '/chat/{chat}'
 */
destroyForm.delete = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;
const chat = {
    messages: Object.assign(messages, messages),
    send: Object.assign(send, send),
    create: Object.assign(create, create),
    searchByPin: Object.assign(searchByPin, searchByPin),
    startAdminChat: Object.assign(startAdminChat, startAdminChat),
    destroy: Object.assign(destroy, destroy),
};

export default chat;
