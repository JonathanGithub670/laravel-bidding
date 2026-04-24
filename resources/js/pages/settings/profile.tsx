import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { send } from '@/routes/verification';
import type { SharedData } from '@/types';
import { Camera, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { useState } from 'react';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <AppLayout>
            <Head title="Profile settings" />

            <SettingsLayout>
                {/* Page Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Profile
                    </h2>
                </div>

                {/* Profile Card - User Meta */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                    <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        Profile
                    </h3>
                    
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="bg-brand-500 text-white text-xl">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white shadow hover:bg-brand-600 transition-colors">
                                        <Camera className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                
                                {/* User Info */}
                                <div className="order-3 xl:order-2 text-center xl:text-left">
                                    <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                                        {auth.user.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {auth.user.email}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Edit Button */}
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </button>
                        </div>
                    </div>
                </div>

                {/* Personal Information Card */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                Personal Information
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Update your name and email address
                            </p>

                            {isEditing ? (
                                <Form
                                    {...ProfileController.update.form()}
                                    options={{
                                        preserveScroll: true,
                                    }}
                                    onSuccess={() => setIsEditing(false)}
                                >
                                    {({ processing, recentlySuccessful, errors }) => (
                                        <div className="space-y-5">
                                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
                                                <div>
                                                    <Label 
                                                        htmlFor="name"
                                                        className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400"
                                                    >
                                                        Full Name
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                                                        defaultValue={auth.user.name}
                                                        name="name"
                                                        required
                                                        autoComplete="name"
                                                        placeholder="Full name"
                                                    />
                                                    <InputError className="mt-2" message={errors.name} />
                                                </div>

                                                <div>
                                                    <Label 
                                                        htmlFor="email"
                                                        className="mb-2 block text-xs leading-normal text-gray-500 dark:text-gray-400"
                                                    >
                                                        Email Address
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                                                        defaultValue={auth.user.email}
                                                        name="email"
                                                        required
                                                        autoComplete="username"
                                                        placeholder="Email address"
                                                    />
                                                    <InputError className="mt-2" message={errors.email} />
                                                </div>
                                            </div>

                                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                                <div className="rounded-lg bg-warning-50 p-4 dark:bg-warning-500/10">
                                                    <p className="text-sm text-warning-600 dark:text-warning-400">
                                                        Your email address is unverified.{' '}
                                                        <Link
                                                            href={send()}
                                                            as="button"
                                                            className="font-medium underline underline-offset-2 hover:text-warning-700"
                                                        >
                                                            Click here to resend the verification email.
                                                        </Link>
                                                    </p>
                                                    {status === 'verification-link-sent' && (
                                                        <p className="mt-2 text-sm font-medium text-success-600">
                                                            A new verification link has been sent to your email address.
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-3 pt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsEditing(false)}
                                                    className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    disabled={processing}
                                                    className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                                                    data-test="update-profile-button"
                                                >
                                                    Save Changes
                                                </Button>

                                                <Transition
                                                    show={recentlySuccessful}
                                                    enter="transition ease-in-out"
                                                    enterFrom="opacity-0"
                                                    leave="transition ease-in-out"
                                                    leaveTo="opacity-0"
                                                >
                                                    <span className="text-sm text-success-600 dark:text-success-400">
                                                        Saved successfully!
                                                    </span>
                                                </Transition>
                                            </div>
                                        </div>
                                    )}
                                </Form>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Full Name
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {auth.user.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Email Address
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Delete Account Card */}
                <div className="rounded-2xl border border-error-200 bg-error-50/50 p-5 dark:border-error-900 dark:bg-error-500/5 lg:p-6">
                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
