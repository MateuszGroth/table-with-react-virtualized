import React, { useState, useContext } from 'react';
import { CLASS_NAMES } from './constant';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';

import Context from './context';

// todo use reactstrap datepicker
const TimeRangeSelector = defaultProps => {
    const contextProps = useContext(Context);
    const [shouldUseContext] = useState(contextProps.shouldUseContext);
    const props = shouldUseContext ? contextProps : defaultProps;

    const [startIsFocused, setStartIsFocused] = useState(false);
    const [endIsFocused, setEndIsFocused] = useState(false);
    const handleClearClick = () => props.handleTimeClearClick && props.handleTimeClearClick();
    const areDatesInvalid = props.startDate != null && props.endDate != null && props.startDate > props.endDate;
    return (
        <div
            className={`${CLASS_NAMES.DATE_RANGE_CONT}${props.timeContClassName ? ` ${props.timeContClassName} ` : ''}`}
        >
            <div className={`${CLASS_NAMES.DATE_PICKER_CONT}`}></div>
            <label
                className={`${CLASS_NAMES.DATE_RANGE_LABEL} ${CLASS_NAMES.DATE_RANGE_LABEL_START}${
                    areDatesInvalid && startIsFocused ? ` tooltip tooltip--visible tooltip--left` : ''
                }`}
                message={areDatesInvalid ? 'From Date can not be later that To Date' : ''}
            >
                {props.timeStartLabel || 'From :'}
            </label>
            <DatePicker
                showYearDropdown={true}
                scrollableYearDropdown={true}
                dateFormat="yyyy-MM-dd"
                minDate={props.minDate}
                maxDate={props.maxDate}
                selected={props.startDate}
                onCalendarOpen={() => setStartIsFocused(true)}
                onCalendarClose={() => setStartIsFocused(false)}
                calendarClassName={CLASS_NAMES.DATE_PICKER}
                wrapperClassName={`${CLASS_NAMES.DATE_PICKER_WRAP}`}
                onChange={date => props.handleStartDateChange && props.handleStartDateChange(date)}
                className={`form-control${props.timeStartClassName ? ` ${props.timeStartClassName} ` : ''}${
                    areDatesInvalid ? ` is-invalid` : ``
                }`}
            />
            <label
                className={`${CLASS_NAMES.DATE_RANGE_LABEL} ${CLASS_NAMES.DATE_RANGE_LABEL_END}${
                    areDatesInvalid && endIsFocused ? ` tooltip tooltip--visible tooltip--left` : ''
                }`}
                message={areDatesInvalid ? 'To Date can not be earlier that From Date' : ''}
            >
                {props.timeEndLabel || 'To :'}
            </label>
            <DatePicker
                showYearDropdown={true}
                scrollableYearDropdown={true}
                dateFormat="yyyy-MM-dd"
                minDate={props.minDate}
                maxDate={props.maxDate}
                selected={props.endDate}
                test="coo"
                onCalendarOpen={() => setEndIsFocused(true)}
                onCalendarClose={() => setEndIsFocused(false)}
                calendarClassName={CLASS_NAMES.DATE_PICKER}
                // wrapperClassName={`${CLASS_NAMES.DATE_PICKER_WRAP}${
                //     areDatesInvalid ? ` ${CLASS_NAMES.DATE_PICKER_INVALID}` : ''
                // }${endIsFocused ? ` ${CLASS_NAMES.DATE_PICKER_FOCUS}` : ''}`}
                onChange={date => props.handleEndDateChange && props.handleEndDateChange(date)}
                className={`form-control${props.timeEndClassName ? ` ${props.timeEndClassName} ` : ''}${
                    areDatesInvalid ? ` is-invalid` : ``
                }`}
            />
            {!props.isClearTimeRangeHidden && (
                <button
                    disabled={props.isClearDateDisabled}
                    onClick={handleClearClick}
                    className={`${CLASS_NAMES.CLEAR} ${CLASS_NAMES.DATE_RANGE_CLEAR} btn`}
                >
                    Clear
                </button>
            )}
        </div>
    );
};
TimeRangeSelector.propTypes = {
    handleStartDateChange: PropTypes.func,
    handleEndDateChange: PropTypes.func,
    handleTimeClearClick: PropTypes.func,
    timeContClassName: PropTypes.string,
    timeStartClassName: PropTypes.string,
    timeEndClassName: PropTypes.string,
    timeStartLabel: PropTypes.string,
    timeEndLabel: PropTypes.string,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    isClearTimeRangeHidden: PropTypes.bool
};

export default TimeRangeSelector;
