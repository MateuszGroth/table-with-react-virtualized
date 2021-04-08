import React, { useState, useEffect } from 'react';

import Cell from './Cell';
import Row from './Row';

import { CLASS_NAMES, HEADER_ATTRIBUTES, DEFAULT_ROW_HEIGHT } from './constant';

export function naturalComparator(a, b) {
    var cnt = 0,
        tem;
    a = String(a).toLowerCase();
    b = String(b).toLowerCase();

    if (a === b) return 0;
    if (/\d/.test(a) || /\d/.test(b)) {
        var Rx = /^\d+(\.\d+)?/;
        while (a.charAt(cnt) === b.charAt(cnt) && !Rx.test(a.substring(cnt))) {
            cnt++;
        }
        a = a.substring(cnt);
        b = b.substring(cnt);
        if (Rx.test(a) || Rx.test(b)) {
            if (!Rx.test(a)) return a ? 1 : -1;
            if (!Rx.test(b)) return b ? -1 : 1;
            tem = parseFloat(a) - parseFloat(b);
            if (tem !== 0) return tem;
            a = a.replace(Rx, '');
            b = b.replace(Rx, '');
            if (/\d/.test(a) || /\d/.test(b)) {
                return naturalComparator(a, b);
            }
        }
    }

    if (a === b) return 0;
    return a > b ? 1 : -1;
}

//escapes all reg exp special characters from string which is used as a pattern for creating regExp via regExp() object
export const escapeRegExp = text => text.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

/**
 * Function transforms search text inserted by the user above the table into two regexps
 * In first case, the search text will be treated as an actual regexp string and converted into valid regext
 * In second case, the search text will be treated as a plain text and transformed into regexp with escaped special characters
 *
 * @param {String} searchText
 *
 * @return {Object}
 */
export const getTableFilterRegexpObj = searchText => {
    const regexpObj = {
        base: null,
        escaped: new RegExp(escapeRegExp(searchText), 'gi')
    };

    try {
        regexpObj.base = new RegExp(searchText, 'gi');
    } catch (e) {}

    return regexpObj;
};

/**
 * Checks if user provided a valid rowComponent and returns it if so. Otherwise returns default Row Component
 * @param {Object} rowComponent
 * @return {Object} Valid Row Component
 */
const getTableRowComponent = rowComponent => {
    if (rowComponent != null) {
        return rowComponent;
    }

    return Row;
};

/**
 * Checks if user provided a valid cellComponent and returns it if so. Otherwise returns default Cell Component
 * @param {Object} cellComponent
 * @return {Object} Valid Cell Component
 */
const getTableCellComponent = cellComponent => {
    if (cellComponent != null) {
        return cellComponent;
    }

    return Cell;
};

/**
 * Checks if attribute is provied within an object
 * @param {Object} obj
 * @param {String} attrName
 * @return {Boolean} is provied
 */
const isAttributeProvided = (obj, attrName) => obj != null && obj[attrName] != null;

/**
 * Process Table Header
 * @param {Array} header - header data
 * @param {Object} handleHeaderClick - header Click Callback
 * @param {Number} sortBy - index of the column the table is sorted by
 * @param {String} sortDir - 'asc' or 'desc'
 * @param {Boolean} isSortable
 * @param {Object} CellComponent
 * @return {Array} display header cells
 */
const mapHeader = (
    header,
    handleHeaderClick,
    sortBy,
    sortDir,
    isSortable,
    isExpandable,
    focusedCellId,
    isFocused,
    CellComponent
) => {
    return header.map((head, i) => {
        const cellComponentProps = { key: i, cellData: head, cellId: i };
        const isThisColumnSortable = isSortable && head.sortable !== false;
        const isSortedBy = isThisColumnSortable && sortBy === i;

        let className = CLASS_NAMES.HEADER_CELL;

        if (head.className) className += ` ${head.className}`;
        if (isSortedBy) className += ` ${CLASS_NAMES.SORTED_HEADER_CELL} ${CLASS_NAMES.SORTED_HEADER_CELL}--${sortDir}`;

        if (isThisColumnSortable && handleHeaderClick) {
            const headerClickCallback = handleHeaderClick(head, i);
            cellComponentProps.onClick = headerClickCallback;
            className += ` ${CLASS_NAMES.POINTER_CELL}`;
        }

        const processedFocusedCellId = isExpandable && !isNaN(focusedCellId) ? focusedCellId - 1 : focusedCellId;
        if (cellComponentProps.onClick && isFocused && processedFocusedCellId === i) {
            className += ` ${CLASS_NAMES.FOCUS_CELL}`;
        }

        if (isAttributeProvided(head, HEADER_ATTRIBUTES.COLUMN_WIDTH)) {
            cellComponentProps.style = {
                flexBasis: `${head[HEADER_ATTRIBUTES.COLUMN_WIDTH]}px`,
                flexGrow: '0',
                flexShrink: '0'
            };
        }

        cellComponentProps.className = className;

        return (
            <CellComponent {...cellComponentProps}>
                {typeof head !== 'object' ? head : head.cellValue}
                {isSortedBy && <span className={CLASS_NAMES.SORTED_HEADER_SPAN}></span>}
            </CellComponent>
        );
    });
};

/**
 * Process Table Row
 * @param {Object} rowData - row data
 * @param {Number} rowId
 * @param {Array} header - header data
 * @param {Object} CellComponent
 * @return {Array} display cells
 */
const processTableRow = (rowData, rowId, header, isExpandable, focusedCellId, CellComponent) =>
    rowData.cells.map((cellData, cellId) => {
        if (isAttributeProvided(header[cellId], HEADER_ATTRIBUTES.COLUMN_FORMATTER)) {
            return header[cellId][HEADER_ATTRIBUTES.COLUMN_FORMATTER]({ rowId, cellData, rowData, cellId });
        }

        const tableCellProps = { key: cellId, rowData, rowId, cellId, cellData };

        const classNameArr = [];
        const processedFocusedCellId = isExpandable && !isNaN(focusedCellId) ? focusedCellId - 1 : focusedCellId;

        if (processedFocusedCellId === cellId) classNameArr.push(CLASS_NAMES.FOCUS_CELL);
        if (isAttributeProvided(header[cellId], HEADER_ATTRIBUTES.COLUMN_WIDTH)) {
            tableCellProps.style = {
                flexBasis: `${header[cellId][HEADER_ATTRIBUTES.COLUMN_WIDTH]}px`,
                flexGrow: '0',
                flexShrink: '0'
            };
        }
        if (isAttributeProvided(header[cellId], HEADER_ATTRIBUTES.COLUMN_CLASSNAME)) {
            classNameArr.push(header[cellId][HEADER_ATTRIBUTES.COLUMN_CLASSNAME]);
        }

        if (typeof cellData === 'object' && cellData.className) {
            classNameArr.push(cellData.className);
        }

        if (classNameArr.length) {
            tableCellProps.className = classNameArr.join(' ');
        }

        if (isAttributeProvided(header[cellId], HEADER_ATTRIBUTES.COLUMN_VALUE_FORMATTER)) {
            return (
                <CellComponent {...tableCellProps}>
                    {header[cellId][HEADER_ATTRIBUTES.COLUMN_VALUE_FORMATTER]({ rowId, cellData, rowData, cellId })}
                </CellComponent>
            );
        }

        if (typeof cellData !== 'object') {
            return <CellComponent {...tableCellProps}>{cellData}</CellComponent>;
        }

        return <CellComponent {...tableCellProps}>{cellData.cellValue}</CellComponent>;
    });

/**
 * Calculate and track dimensions of an element
 * @param {Object} ref - reference to the tracked element
 * @return {Object} dimensions
 */
const useResizeObserver = ref => {
    const [dimensions, setDimensions] = useState(null);

    useEffect(() => {
        const referenceNode = ref.current;
        const resizeObserver = new ResizeObserver(entries => {
            setDimensions(entries[0].contentRect);
        });

        resizeObserver.observe(referenceNode);

        return () => {
            if (!referenceNode) {
                return;
            }
            resizeObserver.unobserve(referenceNode);
        };
    }, [ref]);
    return dimensions;
};

const sortTableItems = (data, sortBy, sortDir, sortFunc = null) => {
    const dataCopy = [...data]; // we dont want to sort the original array, just return a new sorted copy of original

    const multiplier = sortDir === 'asc' ? 1 : -1;
    if (sortFunc == null) {
        return dataCopy.sort(
            (a, b) =>
                multiplier *
                naturalComparator(
                    typeof a.cells[sortBy] === 'string' ? a.cells[sortBy] : a.cells[sortBy].cellValue,
                    typeof b.cells[sortBy] === 'string' ? b.cells[sortBy] : b.cells[sortBy].cellValue
                )
        );
    }

    return dataCopy.sort((a, b) => multiplier * sortFunc(a.cells[sortBy], b.cells[sortBy]));
};

/**
 * Filters Data by given filter text, including the possibility of filtering with a use of regexps
 * @param {Array} data - table data
 * @param {String} filterText
 * @return {Array} filtered data
 */
const filterDataByText = (() => {
    const prepareCellValue = cellValue =>
        cellValue == null ? '' : typeof cellValue === 'string' ? cellValue : '' + cellValue;
    const isCellMatching = (cellValue = '', regexp) => prepareCellValue(cellValue).match(regexp);

    const getIsRowMatchingCallback = regexp => row => {
        if (row == null || regexp == null) {
            return false;
        }

        const matchingCell = row.cells.find(cell => {
            if (typeof cell === 'object' && cell.cellValue != null && isCellMatching(cell.cellValue, regexp)) {
                return true;
            }
            if (typeof cell === 'string' && isCellMatching(cell, regexp)) {
                return true;
            }
            return false;
        });
        if (matchingCell) {
            return true;
        }

        if (!row.children || !row.children.length) {
            return false;
        }

        const matchingChildren = row.children.find(children =>
            children.cells.find(cell => {
                if (typeof cell === 'object' && cell.cellValue != null && isCellMatching(cell.cellValue, regexp)) {
                    return true;
                }
                if (typeof cell === 'string' && isCellMatching(cell, regexp)) {
                    return true;
                }
                return false;
            })
        );

        if (matchingChildren) {
            return true;
        }

        return false;
    };

    return (data, filterText) => {
        const regexpSearchResultArray = [];
        const plainTextSearchResultArray = [];

        const { base, escaped } = getTableFilterRegexpObj(filterText);

        const isRowMatchingBaseRegexp = getIsRowMatchingCallback(base);
        const isRowMatchingEscapedRegexp = getIsRowMatchingCallback(escaped);

        data.forEach(rowObj => {
            if (base == null) {
                // nothing
            } else if (isRowMatchingBaseRegexp(rowObj)) {
                return regexpSearchResultArray.push(rowObj);
            }

            // if there is at least a single match for base regexp, we do not need to check if plain text matches
            // because we are going to return regexpSearchResultArray anyway
            if (regexpSearchResultArray.length) {
                return;
            }

            if (isRowMatchingEscapedRegexp(rowObj)) {
                return plainTextSearchResultArray.push(rowObj);
            }
        });

        return regexpSearchResultArray.length ? regexpSearchResultArray : plainTextSearchResultArray;
    };
})();

/**
 * Parses cells data of a single row for export
 * @param {Array} cells - cells data
 * @param {Boolean} shouldPrependTableColumn - used in case of expandable tables
 * @param {Boolean} hasChildrenItems
 * @return {Array} parsed cells data
 */
const parseCellsForExport = (cells, shouldPrependTableColumn, hasChildrenItems = false) => {
    const parsedCellsList = cells.map(cell => (cell.cellValue != null ? cell.cellValue : cell));
    return shouldPrependTableColumn ? [hasChildrenItems ? '-' : '', ...parsedCellsList] : parsedCellsList;
};

/**
 * Parses table data for export
 * @param {Boolean} print - prepare for print or csv export
 * @param {Array} header - header data
 * @param {Array} tableData - table data
 * @param {Boolean} isExpandable - is table expandable
 * @return {Array} parsed table data
 */
const parseDataForExports = (print = true) => (header, tableData, isExpandable = false) => {
    const shouldPrependTableColumn = print && isExpandable;
    const headerValuesList = header.map(headCell => (headCell.cellValue != null ? headCell.cellValue : headCell));
    const headerArray = shouldPrependTableColumn ? ['', ...headerValuesList] : headerValuesList;

    const rowsArray = tableData.reduce((tmpRowArr, row) => {
        const hasChildrenItems = row.children && row.children.length && row.blockExpand !== true;
        tmpRowArr.push(parseCellsForExport(row.cells, shouldPrependTableColumn, hasChildrenItems));

        if (hasChildrenItems) {
            row.children.forEach(childrenItem =>
                tmpRowArr.push(parseCellsForExport(childrenItem.cells, shouldPrependTableColumn))
            );
        }
        return tmpRowArr;
    }, []);

    return { header: headerArray, body: rowsArray };
};

/**
 * Changes end date so it has hours, minutes, secods set to 23:59:59.
 * Needs to be done so filter does not exclude table row objects with date (year, month, day) equal to original end date
 * but greater hours/minutes/seconds
 * @param {Date} endDate
 * @return {Date} endDate
 */
const adjustEndDate = endDate => {
    if (endDate != null) {
        endDate.setHours(23, 59, 59);
    }
    return endDate;
};
/**
 * Changes start date so it has hours, minutes, secods set to 0:00:00.
 * Needs to be done so filter does not exclude table row objects with date (year, month, day) equal to original start date
 * but lower hours/minutes/seconds
 * @param {Date} endDate
 * @return {Date} endDate
 */
const adjustStartDate = startDate => {
    if (startDate != null) {
        startDate.setHours(0, 0, 0);
    }
    return startDate;
};

const filterDataByDate = (data, startDate, endDate) => {
    const start = startDate == null ? null : adjustStartDate(new Date(startDate));
    const end = endDate == null ? null : adjustEndDate(new Date(endDate));
    return data.filter(({ timestamp }) => {
        if (timestamp == null) {
            return false;
        }

        if (start && start > timestamp) {
            return false;
        }
        if (end && end < timestamp) {
            return false;
        }

        return true;
    });
};

const getTableHeight = (data, rowHeight = DEFAULT_ROW_HEIGHT) => {
    const headerHeight = rowHeight;
    if (data == null || !data.length) {
        return rowHeight + headerHeight;
    }

    if (data.length > 50) {
        return 2000;
    }

    return data.length * rowHeight + headerHeight;
};

const printTable = console.log;
const exportCsv = console.log;

export {
    useResizeObserver,
    mapHeader,
    getTableRowComponent,
    isAttributeProvided,
    getTableCellComponent,
    processTableRow,
    sortTableItems,
    filterDataByText,
    filterDataByDate,
    parseDataForExports,
    getTableHeight,
    printTable,
    exportCsv
};
