import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faXmark } from '@fortawesome/free-solid-svg-icons';

// TODO: downward / upward display (dependend on available space)
// TODO? month navigation left/right arrow buttons

// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters
const dayFormatter = new Intl.DateTimeFormat(undefined, {
    // weekday: "long",
    weekday: "short",
});

const monthFormatter = new Intl.DateTimeFormat(undefined, {
    month: "long",
});

const dayNames = new Array(8).fill('').map((_, i) => {
    // ( ) May 2023 starts on a Monday
    // (*) October 2023 starts on a Sunday
    let s = dayFormatter.format(new Date(Date.UTC(2023, 9, 1+i, 12, 0, 0, 0)));
    return s.charAt(0).toUpperCase() + s.slice(1);
});

const monthNames = new Array(12).fill('').map((_, i) => {
    let s = monthFormatter.format(new Date(Date.UTC(2000, i, 1, 12, 0, 0, 0)));
    return s.charAt(0).toUpperCase() + s.slice(1);
});

const dateRegex = /^\d{1,2}-\d{1,2}-\d{1,4}$/;

export default forwardRef( function DatePickerInput({
    type = 'text',
    className = '',
    isFocused = false,
    showClear = true,
    showIcon = true,
    weekDayStart = 1, // Starts on Sunday (0) or Monday (1)
    onChange = () => {},
    ...props
}, ref) {
    const input = ref ? ref : useRef();
    const wrapper = useRef();
    const picker = useRef();
    const calendar = useRef();

    const [month, setMonth] = useState((new Date()).getUTCMonth());
    const [year, setYear] = useState((new Date()).getUTCFullYear());
    const [focusDay, setFocusDay] = useState(0);

    const onKeyDownMonth = useCallback((e) => {
        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                if (e.target.selectedIndex === 0) {
                    e.preventDefault();
                    // // e.target.selectedIndex = e.target.options.length - 1;
                    // e.target.value = e.target.options[e.target.options.length - 1].value;
                    // e.target.dispatchEvent(new Event('change', { bubbles: true }));
                    setMonth(e.target.options[e.target.options.length - 1].value);
                    // TODO? decrease year?
                }
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                if (e.target.selectedIndex === e.target.options.length - 1) {
                    e.preventDefault();
                    // // e.target.selectedIndex = 0;
                    // e.target.value = e.target.options[0].value;
                    // e.target.dispatchEvent(new Event('change', { bubbles: true }));
                    setMonth(e.target.options[0].value);
                    // TODO? increase year?
                }
                break;
            default:
                break;
        }
    }, [setMonth]);

    const onKeyDownDay = useCallback((e) => {
        let change = 0;
        switch (e.key) {
            case 'ArrowUp':
                change = -7;
                break;
            case 'ArrowDown':
                change = 7;
                break;
            case 'ArrowLeft':
                change = -1;
                break;
            case 'ArrowRight':
                change = 1;
                break;
            default:
                break;
        }
        if (change !== 0) {
            e.preventDefault();
            e.stopPropagation();
            const d = parseInt(e.target.dataset.d);
            const m = parseInt(e.target.dataset.m)-1;
            const y = parseInt(e.target.dataset.y);
            const otherDate = new Date(Date.UTC(y, m, d + change, 12, 0, 0, 0));

            if (otherDate.getUTCFullYear() !== y) {
                setYear(otherDate.getUTCFullYear());
            }
            if (otherDate.getUTCMonth() !== m) {
                setMonth(otherDate.getUTCMonth());
            }
            setFocusDay(otherDate.getUTCDate());
        }
    }, [setFocusDay, setMonth, setYear]);

    const onChangeMonth = useCallback((e) => {
        setMonth(e.target.value);
    }, [setMonth]);

    const onChangeYear = useCallback((e) => {
        setYear(e.target.value);
    }, [setYear]);

    const updateMonthYearAccordingToValue = useCallback((value) => {
        if (value?.length && value.match(dateRegex)) {
            const [_, m, y] = value.split('-').map(v => parseInt(v));
            setMonth(m-1);
            setYear(y);
        }
    }, [setMonth, setYear, dateRegex]);

    const setValue = useCallback((v) => {
        updateMonthYearAccordingToValue(v);
        // input.current.focus();
        input.current.value = v;
        onChange({ target: input.current });
    }, [onChange, updateMonthYearAccordingToValue]);

    const onChangeReplacement = useCallback((e) => {
        setValue(e.target.value);
    }, [setValue]);

    const pickDate = useCallback((e) => {
        e.preventDefault();
        const d = e.target.dataset.d.toString().padStart(2, '0');
        const m = e.target.dataset.m.toString().padStart(2, '0');
        const y = e.target.dataset.y.toString().padStart(4, '0');
        setValue(`${d}-${m}-${y}`);
    }, [setValue]);

    const onFocusClearButton = useCallback((e) => {
        // If clear button receives focus from element outside picker, redirect to input.
        if (e.relatedTarget && !wrapper.current?.contains(e.relatedTarget)) {
            e.preventDefault();
            input.current.focus();
        }
    }, []);

    const clearField = useCallback((e) => {
        e.preventDefault();
        input.current.focus();
        setValue('');
    }, [setValue]);

    const onFocusInput = useCallback((e) => {
        updateMonthYearAccordingToValue(e.target.value);

        // Calculate which vertical half it's on
        // and open towards the other half.
        const { top, bottom } = wrapper.current.getBoundingClientRect();
        const directionToggle = top > window.innerHeight - bottom;
        picker.current?.classList.toggle('downward', !directionToggle);
        picker.current?.classList.toggle('upward', directionToggle);

        picker.current?.classList.remove('hidden');
    }, [updateMonthYearAccordingToValue]);

    const onBlurWrapper = useCallback((e) => {
        if (!e.relatedTarget || !wrapper.current?.contains(e.relatedTarget) ) {
            picker.current?.classList.add('hidden');
        }
    }, []);

    const clearIsShown = useMemo(() => {
        return showClear && input.current?.value?.length > 0;
    }, [input.current?.value, showClear]);

    const selectedDayIfSelectedMonthIsShowing = useMemo(() => {
        if (!input.current?.value?.length || !input.current.value.match(dateRegex)) {
            return -1;
        }
        const [d, m, y] = input.current.value.split('-').map(v => parseInt(v));
        return m === parseInt(month)+1 && y === (year ? parseInt(year) : 1900) ? d : -1;
    }, [input.current?.value, month, year]);

    const weekDayHeads = useMemo(() => {
        return (new Array(7).fill(0).map((_, i) => (
            <span key={i} className="pb-1 text-xs text-center text-gray-300 uppercase">{dayNames[(i + weekDayStart)]}</span>
        )));
    }, [dayNames, weekDayStart, dateRegex]);

    const dayButtons = useMemo(() => {
        const m = parseInt(month);
        const y = year ? parseInt(year) : 1900;
        const lastDay = new Date(Date.UTC(y, m+1, 0, 12));
        const maxDays = lastDay.getUTCDate();
        const firstWeekDay = (((lastDay.getUTCDay() - (maxDays-1) - weekDayStart) % 7) + 7) % 7;

        return (new Array(maxDays)).fill(0).map((_, i) => {
            const isSelectedDay = selectedDayIfSelectedMonthIsShowing === (i+1);
            return (
                <button
                    key={i}
                    type="button"
                    onKeyDown={onKeyDownDay}
                    tabIndex={(0 > selectedDayIfSelectedMonthIsShowing && i===0) || isSelectedDay ? 0 : -1}
                    className={
                        "flex items-center justify-center leading-none rounded-full aspect-square border-2 border-transparent pt-[1px] " +
                        "hover:z-10 hover:border-indigo-300 " +
                        "focus:border-indigo-500 " +
                        `${isSelectedDay ? 'bg-indigo-300 border-indigo-300 !text-white ' : ''}` +
                        `${isSelectedDay ? 'focus:!bg-indigo-500 ' : ''}` +
                        "outline-none"
                    }
                    data-d={i+1}
                    data-m={m+1}
                    data-y={y}
                    onClick={pickDate}
                    style={{
                        gridColumn: i===0 ? firstWeekDay+1: 'auto',
                    }}
                >{(i+1)}</button>
            );
        });
    }, [weekDayStart, month, year, selectedDayIfSelectedMonthIsShowing, pickDate, onKeyDownDay]);

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    useEffect(() => {
        if (focusDay) {
            // Skip 7 weekday heads and adjust for zero-based index.
            calendar.current?.children[focusDay+6]?.focus();
        }
    }, [focusDay]);

    return (
        <span className="relative group" ref={wrapper} onBlur={onBlurWrapper}>
            <input
                {...props}
                onChange={onChangeReplacement}
                onFocus={onFocusInput}
                type={type}
                className={
                    'border-gray-300 ' +
                    'group-focus-within:border-indigo-500 group-focus-within:ring-indigo-500 group-focus-within:ring-1 ' +
                    'rounded-md shadow-sm ' +
                    `${showIcon ? 'pl-11 ' : ''}` +
                    `${clearIsShown ? 'pr-11 ' : ''}` +
                    className
                }
                ref={input}
                autoComplete="off"
            />

            {clearIsShown && <a href="#"
                className={
                    "z-20 absolute outline-0 top-0 right-0 ms-[1px] flex items-center h-full pr-3 " +
                    "text-gray-300 focus:text-red-500 hover:text-red-500 "
                }
                onClick={clearField}
                onFocus={onFocusClearButton}
            >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
            </a>}

            {showIcon && <div className="z-20 absolute top-0 left-0 ms-[1px] flex items-center h-full pl-3 pointer-events-none">
                <FontAwesomeIcon icon={faCalendarDays} className="w-5 h-5 text-gray-300 group-focus-within:text-indigo-300" />
            </div>}

            <div
                ref={picker}
                className={
                    "datepicker-picker " +
                    "hidden z-10 absolute h-fit " +
                    // "shadow-lg " +
                    "rounded-md border-2 " +
                    "border-indigo-500 ring-indigo-500 bg-white"
                }
            >
                <div className="flex">
                    <div className="flex flex-row justify-center gap-2 px-2">
                        <select
                            onChange={onChangeMonth}
                            onKeyDown={onKeyDownMonth}
                            value={month}
                            className={
                                "flex w-auto text-right " +
                                "bg-none pr-3 border-0 rounded-md " +
                                "font-bold ring-2 ring-indigo-50 hover:ring-indigo-300 " +
                                "focus:bg-white focus:ring-2 focus:ring-indigo-500"
                            }
                        >
                            {monthNames.map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                        <span className="relative">
                            <span className="inline-block whitespace-nowrap min-w-[4rem] px-3 opacity-0">{year}</span>
                            <input
                                onChange={onChangeYear}
                                value={year}
                                type="number"
                                className={
                                    "input-number-as-text absolute top-0 left-0 w-full flex " +
                                    "border-0 rounded-md " +
                                    "text-center font-bold ring-2 ring-indigo-50 hover:ring-indigo-300 " +
                                    "focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                }
                            />
                        </span>
                    </div>
                    <div ref={calendar} className="grid grid-cols-7 px-2 mt-3">
                        {weekDayHeads}
                        {dayButtons}
                    </div>
                </div>
            </div>
        </span>
    );
});
