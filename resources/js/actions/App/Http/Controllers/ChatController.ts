import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:15
 * @route '/chat'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/chat',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:15
 * @route '/chat'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:15
 * @route '/chat'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:15
 * @route '/chat'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:15
 * @route '/chat'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:15
 * @route '/chat'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ChatController::index
 * @see app/Http/Controllers/ChatController.php:15
 * @route '/chat'
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
 * @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
export const getMessages = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: getMessages.url(args, options),
    method: 'get',
});

getMessages.definition = {
    methods: ['get', 'head'],
    url: '/chat/{chat}/messages',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
getMessages.url = (
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
        getMessages.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
getMessages.get = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: getMessages.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
getMessages.head = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: getMessages.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
const getMessagesForm = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getMessages.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
getMessagesForm.get = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getMessages.url(args, options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\ChatController::getMessages
 * @see app/Http/Controllers/ChatController.php:115
 * @route '/chat/{chat}/messages'
 */
getMessagesForm.head = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getMessages.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

getMessages.form = getMessagesForm;
/**
 * @see \App\Http\Controllers\ChatController::sendMessage
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
export const sendMessage = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: sendMessage.url(args, options),
    method: 'post',
});

sendMessage.definition = {
    methods: ['post'],
    url: '/chat/{chat}/messages',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ChatController::sendMessage
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
sendMessage.url = (
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
        sendMessage.definition.url
            .replace('{chat}', parsedArgs.chat.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ChatController::sendMessage
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
sendMessage.post = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: sendMessage.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::sendMessage
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
const sendMessageForm = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: sendMessage.url(args, options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::sendMessage
 * @see app/Http/Controllers/ChatController.php:153
 * @route '/chat/{chat}/messages'
 */
sendMessageForm.post = (
    args:
        | { chat: number | { id: number } }
        | [chat: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: sendMessage.url(args, options),
    method: 'post',
});

sendMessage.form = sendMessageForm;
/**
 * @see \App\Http\Controllers\ChatController::createChat
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
export const createChat = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: createChat.url(options),
    method: 'post',
});

createChat.definition = {
    methods: ['post'],
    url: '/chat/create',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ChatController::createChat
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
createChat.url = (options?: RouteQueryOptions) => {
    return createChat.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ChatController::createChat
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
createChat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createChat.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::createChat
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
const createChatForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: createChat.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ChatController::createChat
 * @see app/Http/Controllers/ChatController.php:189
 * @route '/chat/create'
 */
createChatForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: createChat.url(options),
    method: 'post',
});

createChat.form = createChatForm;
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
const ChatController = {
    index,
    getMessages,
    sendMessage,
    createChat,
    searchByPin,
    startAdminChat,
    destroy,
};

export default ChatController;
