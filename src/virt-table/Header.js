import React from 'react';

import { CLASS_NAMES } from './constant';
import { mapHeader } from './helper';

const Header = ({
    header,
    isExpandable,
    CellComponent,
    RowComponent,
    scrollBarSize,
    handleHeaderClick,
    sortBy,
    sortDir,
    focusedCellId,
    handleHeaderFocus,
    handleHeaderBlur,
    handleHeaderKeyDown,
    isFocused,
    isSortable
}) => {
    return (
        <RowComponent
            className={CLASS_NAMES.HEADER}
            style={{ '--scroll-w': `${scrollBarSize}px` }}
            tabIndex={isSortable ? '0' : '-1'}
            onFocus={handleHeaderFocus}
            onBlur={handleHeaderBlur}
            onKeyDown={handleHeaderKeyDown}
        >
            {isExpandable ? (
                <CellComponent
                    className={`${CLASS_NAMES.SMALL_CELL}${
                        isFocused && focusedCellId === 0 ? ` ${CLASS_NAMES.FOCUS_CELL}` : ''
                    }`}
                ></CellComponent>
            ) : (
                ''
            )}
            {mapHeader(
                header,
                handleHeaderClick,
                sortBy,
                sortDir,
                isSortable,
                isExpandable,
                focusedCellId,
                isFocused,
                CellComponent
            )}
        </RowComponent>
    );
};

export default React.memo(Header);
