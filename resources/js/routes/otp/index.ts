import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OtpController::send
 * @see app/Http/Controllers/OtpController.php:17
 * @route '/otp/send'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/otp/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OtpController::send
 * @see app/Http/Controllers/OtpController.php:17
 * @route '/otp/send'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OtpController::send
 * @see app/Http/Controllers/OtpController.php:17
 * @route '/otp/send'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OtpController::send
 * @see app/Http/Controllers/OtpController.php:17
 * @route '/otp/send'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OtpController::send
 * @see app/Http/Controllers/OtpController.php:17
 * @route '/otp/send'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\OtpController::verify
 * @see app/Http/Controllers/OtpController.php:68
 * @route '/otp/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/otp/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OtpController::verify
 * @see app/Http/Controllers/OtpController.php:68
 * @route '/otp/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OtpController::verify
 * @see app/Http/Controllers/OtpController.php:68
 * @route '/otp/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OtpController::verify
 * @see app/Http/Controllers/OtpController.php:68
 * @route '/otp/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OtpController::verify
 * @see app/Http/Controllers/OtpController.php:68
 * @route '/otp/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const otp = {
    send: Object.assign(send, send),
verify: Object.assign(verify, verify),
}

export default otp