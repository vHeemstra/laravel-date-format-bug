import { useCallback, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DatePickerInput from '@/Components/DatePickerInput';

const filledInDefaultUser = (user) => {
    return {
        name: user?.name || '',
        email: user?.email || '',
        first_name: user?.first_name || '',
        first_names: user?.first_names || '',
        last_name: user?.last_name || '',
        initials: user?.initials || '',
        gender: user?.gender || '',
        date_of_birth: user?.date_of_birth || '',
        date_of_death: user?.date_of_death || '',
    };
};

export default function AddEditModal({
    show = false,
    setShow = () => {},
    mode = 'add',
    user = {},
    onSuccess = () => {},
    onError = () => {},
    className = ''
}) {
    // const user = usePage().props.auth.user;

    const title = {
        add: 'Nieuwe persoon',
        edit: 'Persoon bewerken',
    }[mode];

    const submitLabel = {
        add: 'Toevoegen',
        edit: 'Opslaan',
    }[mode];

    const {
        data,
        setData,
        clearErrors,
        setError,
        // transform,
        // post,
        // patch,
        processing,
        errors,
        recentlySuccessful,
    } = useForm(filledInDefaultUser(user));

    // transform((data) => ({
    //     ...data,
    //     date_of_birth: data.date_of_birth.length ? data.date_of_birth.split('-').reverse().join('-') : '',
    //     date_of_death: data.date_of_death.length ? data.date_of_death.split('-').reverse().join('-') : '',
    // }));

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        const url = mode === 'add' ? route('users.store') : route('users.update', { user: user.id });
        const _method = mode === 'add' ? 'post' : 'patch';
        axios.post(url, {
            ...data,
            // date_of_birth: data.date_of_birth.split('-').reverse().join('-'),
            // date_of_death: data.date_of_death.split('-').reverse().join('-'),
            _method
        })
        .then(function (response) {
            console.log(response.data);
            // TODO: if ok: show success message + close modal + update users (Context and/or Reducer?)
            // response.data.status === 'ok'
            // response.data.user
        })
        .catch(function (error) {
            console.log(error);
            // TODO: show general/other error message
            // OR:
            setError(
                Object.entries(error.response.data.errors).reduce((acc, [k, v]) => {
                    acc[k] = v[0];
                    return acc;
                }, {})
            );
            // error.response.data.message
            // error.response.data.errors = [
            //     field_key: [...errorStrings ]
            // ]
        });

        // NOTE: Inertia does not handle JSON responses...
        // if (mode == 'add') {
        //     post(
        //         route('users.store'),
        //         {
        //             onError,
        //             onSuccess,
        //         },
        //     );
        // } else {
        //     patch(
        //         route('users.update', { user: user.id }),
        //         {
        //             onError,
        //             onSuccess,
        //         },
        //     );
        // }
    };

    const onClose = useCallback(() => {
        setShow(false);
    }, [setShow]);

    useEffect(() => {
        setData(filledInDefaultUser(user));
    }, [user]);

    return (
        <Modal
            show={show}
            setShow={setShow}
            title={title}
            onClose={onClose}
        >
            <div className="p-4 sm:p-6 min-h-[30rem]">
                <section className={className}>
                    <form onSubmit={submit} className="space-y-6" data-lpignore="true" autoComplete="off">
                        {/* name */}
                        {/* <div>
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
                        </div> */}

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

                        <div className="flex flex-col gap-6 sm:flex-row">
                            {/* date_of_birth */}
                            <div className="w-full sm:w-1/2">
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
                            <div className="w-full sm:w-1/2">
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

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>{submitLabel}</PrimaryButton>

                            <Transition
                                show={recentlySuccessful}
                                enterFrom="opacity-0"
                                leaveTo="opacity-0"
                                className="transition ease-in-out"
                            >
                                <p className="text-sm text-gray-600">Opgeslagen.</p>
                            </Transition>
                        </div>
                    </form>
                </section>
            </div>
        </Modal>
    );
}
