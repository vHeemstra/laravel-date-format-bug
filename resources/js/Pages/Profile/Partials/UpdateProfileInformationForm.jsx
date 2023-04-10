import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import DatePickerInput from '@/Components/DatePickerInput';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful, transform } = useForm({
        name: user.name || '',
        email: user.email || '',
        first_name: user.first_name || '',
        first_names: user.first_names || '',
        last_name: user.last_name || '',
        initials: user.initials || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
        date_of_death: user.date_of_death || '',
    });

    transform((data) => ({
        ...data,
        date_of_birth: data.date_of_birth.length ? data.date_of_birth.split('-').reverse().join('-') : '',
        date_of_death: data.date_of_death.length ? data.date_of_death.split('-').reverse().join('-') : '',
    }));

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" data-lpignore="true" autoComplete="off">
                {/* name */}
                <div className="hidden">
                    <InputLabel htmlFor="name" value="Naam" />

                    <TextInput
                        id="name"
                        className="block w-full mt-1"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        // autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* email */}
                <div>
                    <InputLabel htmlFor="email" value="E-mail" />

                    <TextInput
                        id="email"
                        type="email"
                        className="block w-full mt-1"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        // autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div className="flex gap-6">
                    {/* first_name */}
                    <div className="w-1/2">
                        <InputLabel htmlFor="first_name" value="Roepnaam" />

                        <TextInput
                            id="first_name"
                            type="text"
                            className="block w-full mt-1"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                        />

                        <InputError className="mt-2" message={errors.first_name} />
                    </div>

                    {/* initials */}
                    <div className="w-1/2">
                        <InputLabel htmlFor="initials" value="Initialen" />

                        <TextInput
                            id="initials"
                            type="text"
                            className="block w-full mt-1"
                            value={data.initials}
                            onChange={(e) => setData('initials', e.target.value)}
                        />

                        <InputError className="mt-2" message={errors.initials} />
                    </div>
                </div>

                {/* first_names */}
                <div>
                    <InputLabel htmlFor="first_names" value="Voornamen" />

                    <TextInput
                        id="first_names"
                        type="text"
                        className="block w-full mt-1"
                        value={data.first_names}
                        onChange={(e) => setData('first_names', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.first_names} />
                </div>

                {/* last_name */}
                <div>
                    <InputLabel htmlFor="last_name" value="Achternaam" />

                    <TextInput
                        id="last_name"
                        type="text"
                        className="block w-full mt-1"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.last_name} />
                </div>

                {/* gender */}
                <div>
                    <InputLabel htmlFor="gender" value="Geslacht" />

                    <TextInput
                        id="gender"
                        type="text"
                        className="block w-full mt-1"
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                    />

                    <InputError className="mt-2" message={errors.gender} />
                </div>

                <div className="flex gap-6">
                    {/* date_of_birth */}
                    <div className="w-1/2">
                        <InputLabel htmlFor="date_of_birth" value="Geboortedatum" />

                        <DatePickerInput
                            id="date_of_birth"
                            type="text"
                            className="block w-full mt-1"
                            value={data.date_of_birth}
                            onChange={(e) => setData('date_of_birth', e.target.value)}
                        />

                        <InputError className="mt-2" message={errors.date_of_birth} />
                    </div>

                    {/* date_of_death */}
                    <div className="w-1/2">
                        <InputLabel htmlFor="date_of_death" value="Sterfdatum" />

                        <DatePickerInput
                            id="date_of_death"
                            type="text"
                            className="block w-full mt-1"
                            value={data.date_of_death}
                            onChange={(e) => setData('date_of_death', e.target.value)}
                        />

                        <InputError className="mt-2" message={errors.date_of_death} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
