import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useCallback, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faEnvelope, faPen, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddEditModal from '@/Pages/Users/AddEditModal';
import PrimaryButton from '@/Components/PrimaryButton';

const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
};

const default_columns = [
    { key: 'actions', label: ' ', sort: null, sortable: false },
    { key: 'id', label: 'ID', sort: 'asc', },
    { key: 'name', label: 'Name', sort: null, hide: true, },
    { key: 'email', label: 'E-mail', sort: null, },
    { key: 'first_name', label: 'Roepnaam', sort: null, },
    { key: 'first_names', label: 'Voornamen', sort: null, },
    { key: 'last_name', label: 'Achternaam', sort: null, },
    { key: 'initials', label: 'Initialen', sort: null, },
    { key: 'gender', label: 'Geslacht', sort: null, },
    { key: 'date_of_birth', label: 'Geboren', sort: null, },
    { key: 'date_of_death', label: 'Overleden', sort: null, },
];

const columnFilter = (column) => {
    return (!column?.hide);
};

const UserActionButton = ({
    label = '',
    icon = null,
    onClick = () => {},
    className = '',
    href = '',
    ...props
}) => {
    const _icon = icon ? <FontAwesomeIcon icon={icon} className="w-4 h-4" /> : null;
    const _className = [
        `text-indigo-300 hover:text-indigo-500 focus:text-indigo-500`,
        className,
    ].join(' ');

    if (href?.length) {
        return <a href={href} onClick={onClick} className={_className} {...props}>
            {_icon}
            {label}
        </a>;
    } else {
        return <button onClick={onClick} className={_className} {...props}>
            {_icon}
            {label}
        </button>;
    }
};

const UserCell = ({ user, column, actions }) => {
    switch (column.key) {
        case 'actions':
            return <span className="flex gap-2">
                <UserActionButton
                    icon={faPen}
                    onClick={() => actions.edit(user)}
                    title={`Bewerken`}
                />
                <UserActionButton
                    icon={faTrash}
                    className="text-red-300 hover:text-red-500"
                    onClick={() => actions.delete(user.id)}
                    title={`Verwijderen`}
                />
            </span>;
        case 'email':
            return <span className="flex gap-2">
                <UserActionButton
                    icon={faEnvelope}
                    href={`mailto:${user.email}`}
                    target="_blank"
                    title={`Verstuur e-mail naar: ${user.email}`}
                />
                <UserActionButton
                    icon={faCopy}
                    onClick={() => copyToClipboard(user.email)}
                    title={`Kopieer e-mailadres`}
                />
            </span>;
        default:
            return <>{user[column.key] || ''}</>
    }
};

// TODO: toggle columns
// TODO: sort by columns

export default function Users({ auth, users }) {
    const [columns, setColumns] = useState(default_columns);
    const [userObject, setUserObject] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');

    const allUsers = useMemo(() => users.map(u => ({
        ...u,
        // date_of_birth: u.date_of_birth?.length > 0 ? u.date_of_birth.split('-').reverse().join('-') : '',
        // date_of_death: u.date_of_death?.length > 0 ? u.date_of_death.split('-').reverse().join('-') : '',
    })), [users]);

    const openAddUser = useCallback(() => {
        setUserObject({});
        setModalMode('add');
        setShowModal(true);
    }, [setUserObject, setModalMode, setShowModal]);

    const openEditUser = useCallback((user) => {
        if (!user) {
            return;
        }
        setUserObject({ ...user });
        setModalMode('edit');
        setShowModal(true);
    }, [setUserObject, setModalMode, setShowModal]);

    const userActions = useMemo(() => {
        return {
            edit: openEditUser,
            delete: openEditUser,
        };
    }, [openEditUser]);

    const onSuccess = useCallback((page) => {
        console.log('SUCCESS:', page);
    }, []);

    const onError = useCallback((errors) => {
        console.log('ERROR:', errors);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Personen</h2>}
        >
            <Head title="Personen" />

            <AddEditModal
                show={showModal}
                setShow={setShowModal}
                mode={modalMode}
                user={userObject}
                onError={onError}
                onSuccess={onSuccess}
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 lg:mb-8">
                        <PrimaryButton onClick={openAddUser}>Nieuwe persoon</PrimaryButton>
                    </div>

                    <div className="p-1 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        {allUsers?.length > 0 && (
                            <table className="w-full">
                                <thead>
                                    <tr
                                        className={
                                            "text-xs text-gray-300 text-left font-normal uppercase"
                                        }
                                    >
                                        {columns.filter(columnFilter).map((column, ci) => (
                                            <th key={ci} className="p-1 pt-2 font-normal whitespace-nowrap">{column.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map((user, i) => (
                                        <tr key={i}>
                                            {columns.filter(columnFilter).map((column, ci) => (
                                                <td key={`${i}_${ci}`} className="p-1">
                                                    <UserCell user={user} column={column} actions={userActions} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
