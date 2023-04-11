import { Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Modal({
    children,
    show = false,
    title = '',
    footer = null,
    maxWidth = '2xl',
    closeable = true,
    withCloseX = true,
    onClose = () => {},
}) {
    const close = useCallback(() => {
        if (closeable) {
            onClose();
        }
    }, [closeable]);

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-center px-4 py-6 overflow-y-auto transition-all transform sm:px-0"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/75" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={
                            `bg-white rounded-lg overflow-hidden shadow-xl ` +
                            `transform transition-all ` +
                            `sm:w-full sm:mx-auto ` +
                            `${maxWidthClass} ` +
                            `w-full max-h-full flex`
                        }
                    >
                        <div className="flex flex-col items-stretch w-full justify-stretch">
                            {withCloseX && <button
                                type="button"
                                tabIndex={-1}
                                className={
                                    "absolute top-2 right-2 p-2 rounded-full leading-none outline-none " +
                                    "text-gray-300 hover:text-gray-900 focus-visible:text-gray-900 " +
                                    "focus-visible:ring-2 focus-visible:ring-indigo-500"
                                }
                                onClick={close}
                            >
                                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                            </button>}
                            {title?.length > 0 && <Dialog.Title
                                className="p-4 sm:px-6 text-xl font-bold leading-6 text-gray-900 border-b-[1px] border-b-gray-100"
                            >
                                {title}
                            </Dialog.Title>}
                            <div className="flex-grow overflow-y-auto">
                                {children}
                            </div>
                            {footer}
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
