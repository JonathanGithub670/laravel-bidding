import { Form, Head } from '@inertiajs/react';
import {
    ShieldBan,
    ShieldCheck,
    Shield,
    Smartphone,
    RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <AppLayout>
            <Head title="Two-Factor Authentication" />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* Header Card */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                <Shield className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Two-Factor Authentication
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Add an extra layer of security to your
                                    account
                                </p>
                            </div>
                        </div>

                        {twoFactorEnabled ? (
                            <div className="space-y-6">
                                {/* Status Badge */}
                                <div className="border-success-200 dark:border-success-800 flex items-center gap-3 rounded-xl border bg-success-50 p-4 dark:bg-success-500/10">
                                    <ShieldCheck className="dark:text-success-400 h-6 w-6 text-success-600" />
                                    <div>
                                        <p className="text-success-700 dark:text-success-400 font-medium">
                                            Two-Factor Authentication is Enabled
                                        </p>
                                        <p className="text-sm text-success-600 dark:text-success-500">
                                            Your account is protected with an
                                            additional security layer
                                        </p>
                                    </div>
                                </div>

                                {/* How it works */}
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <div className="flex items-start gap-3">
                                        <Smartphone className="mt-0.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            With two-factor authentication
                                            enabled, you will be prompted for a
                                            secure, random pin during login,
                                            which you can retrieve from the
                                            TOTP-supported application on your
                                            phone.
                                        </p>
                                    </div>
                                </div>

                                {/* Recovery Codes Section */}
                                <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <RefreshCw className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                            <h4 className="font-medium text-gray-800 dark:text-white/90">
                                                Recovery Codes
                                            </h4>
                                        </div>
                                    </div>
                                    <TwoFactorRecoveryCodes
                                        recoveryCodesList={recoveryCodesList}
                                        fetchRecoveryCodes={fetchRecoveryCodes}
                                        errors={errors}
                                    />
                                </div>

                                {/* Disable Button */}
                                <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
                                    <Form {...disable.form()}>
                                        {({ processing }) => (
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-lg bg-error-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-error-600 disabled:opacity-50"
                                            >
                                                <ShieldBan className="mr-2 h-4 w-4" />
                                                Disable Two-Factor
                                                Authentication
                                            </Button>
                                        )}
                                    </Form>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Status Badge */}
                                <div className="border-warning-200 dark:border-warning-800 flex items-center gap-3 rounded-xl border bg-warning-50 p-4 dark:bg-warning-500/10">
                                    <ShieldBan className="text-warning-600 dark:text-warning-400 h-6 w-6" />
                                    <div>
                                        <p className="text-warning-700 dark:text-warning-400 font-medium">
                                            Two-Factor Authentication is
                                            Disabled
                                        </p>
                                        <p className="text-warning-600 text-sm dark:text-warning-500">
                                            We recommend enabling 2FA for
                                            enhanced security
                                        </p>
                                    </div>
                                </div>

                                {/* How it works */}
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <div className="flex items-start gap-3">
                                        <Smartphone className="mt-0.5 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            When you enable two-factor
                                            authentication, you will be prompted
                                            for a secure pin during login. This
                                            pin can be retrieved from a
                                            TOTP-supported application on your
                                            phone like Google Authenticator or
                                            Authy.
                                        </p>
                                    </div>
                                </div>

                                {/* Enable Button */}
                                <div className="pt-4">
                                    {hasSetupData ? (
                                        <Button
                                            onClick={() =>
                                                setShowSetupModal(true)
                                            }
                                            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
                                        >
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            Continue Setup
                                        </Button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() =>
                                                setShowSetupModal(true)
                                            }
                                        >
                                            {({ processing }) => (
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                                                >
                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                    Enable Two-Factor
                                                    Authentication
                                                </Button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <TwoFactorSetupModal
                        isOpen={showSetupModal}
                        onClose={() => setShowSetupModal(false)}
                        requiresConfirmation={requiresConfirmation}
                        twoFactorEnabled={twoFactorEnabled}
                        qrCodeSvg={qrCodeSvg}
                        manualSetupKey={manualSetupKey}
                        clearSetupData={clearSetupData}
                        fetchSetupData={fetchSetupData}
                        errors={errors}
                    />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
