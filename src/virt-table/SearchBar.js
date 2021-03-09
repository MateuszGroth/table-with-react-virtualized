import React from 'react';
import PropTypes from 'prop-types';

import { CLASS_NAMES } from './constant';

const SearchBar = props => {
    const handleFilterInputChange = ev => {
        const newValue = ev.target.value;
        props.handleFilterChange && props.handleFilterChange(newValue);
    };

    const handleClearClick = () => props.handleFilterChange && props.handleFilterChange('');
    return (
        <div
            className={`${CLASS_NAMES.SEARCH_CONT}${props.filterContClassName ? ` ${props.filterContClassName} ` : ''}`}
        >
            <input
                onChange={handleFilterInputChange}
                value={props.filterText}
                className={`form-control${props.filterClassName ? ` ${props.filterClassName} ` : ''}`}
                placeholder={props.filterPlaceholder || 'Search'}
            />
            {!props.isClearFilterHidden && (
                <button
                    disabled={props.filterText === ''}
                    onClick={handleClearClick}
                    className={`${CLASS_NAMES.CLEAR} ${CLASS_NAMES.SEARCH_CLEAR} btn`}
                >
                    Clear
                </button>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    handleFilterChange: PropTypes.func,
    filterContClassName: PropTypes.string,
    filterText: PropTypes.string,
    filterClassName: PropTypes.string,
    filterPlaceholder: PropTypes.string,
    isClearFilterHidden: PropTypes.bool
};

export default SearchBar;
