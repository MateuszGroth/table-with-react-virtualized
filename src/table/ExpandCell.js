import React from 'react';

import { CLASS_NAMES } from './constant';

const ExpandCell = ({ CellComponent, isExpanded, handleExpandToggle }) => {
    let className = `${CLASS_NAMES.SMALL_CELL} ${CLASS_NAMES.EXPAND_CELL}`;
    if (isExpanded) {
        className += ` ${CLASS_NAMES.EXPAND_CELL}--expanded`;
    }

    return (
        <CellComponent className={className}>
            <span onClick={handleExpandToggle}></span>
        </CellComponent>
    );
};

export default React.memo(ExpandCell);
