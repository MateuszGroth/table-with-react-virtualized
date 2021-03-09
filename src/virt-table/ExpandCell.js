import React from 'react';

import { CLASS_NAMES } from './constant';

const ExpandCell = ({ CellComponent, isExpanded, handleExpandToggle, rowId, isFocused }) => {
    let className = `${CLASS_NAMES.SMALL_CELL} ${CLASS_NAMES.EXPAND_CELL}`;
    if (isExpanded) className += ` ${CLASS_NAMES.EXPAND_CELL}--expanded`;
    if (isFocused) className += ` ${CLASS_NAMES.FOCUS_CELL}`;

    return (
        <CellComponent rowId={rowId} isExpandCell={true} className={className} onMouseDown={handleExpandToggle}>
            <span></span>
        </CellComponent>
    );
};

export default React.memo(ExpandCell);
