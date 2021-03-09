import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CLASS_NAMES, DEFAULT_NO_DATA_MESSAGE } from './virt-table/constant';
import Header from './virt-table/Header';
import Body from './virt-table/Body';

import 'react-datepicker/dist/react-datepicker.css';

import TimeRangeSelector from './virt-table/TimeRangeSelector';
import TableToolkitProvider from './virt-table/TableToolkitProvider';
import ExportPanel from './virt-table/ExportPanel';
import TableBodyCellComponentWrapper from './virt-table/TableBodyCellComponentWrapper';
import SearchBar from './virt-table/SearchBar';
import TableActionsRow from './virt-table/TableActionsRow';

import { getTableRowComponent, getTableCellComponent, useResizeObserver, getTableHeight } from './virt-table/helper';

/**
 * Virtual Table Component
 * @param {{header, data, noDataMessage, rowComponent, cellComponent, isExpandable, isLoading, onCellClick, onCellContextMenu}} props
 * @param {Array} props.header is of type Array. Elements of that array might be either strings or objects
 * object inside the header array might contain following keys :
 * @param {String} className - adds className to the header cell
 * @param {Boolean} sizeByData - calculates table height with the use of data.length
 * @param {Number} defaultRowHeight - used to calculate table height when sizeByData is set to true
 * @param {String|Number} cellValue - displayed value
 * @param {Boolean} sortable - if table is sortable and head obj has sortable set to false, it will be disabled for that column
 * @param {Function} columnFormatter - function that returns component that will be displayed as the cell of column with id === this header element id
 * @param {Function}columnValueFormatter - function that returns component that will be displayed as the value of cell in column with id === this header element id
 * @param {String} columnClassName - className that will be added to the table cells with column id === this header obj id
 * @param {Function} sortFunc - callback used to sort the data - a, b parameters are provided (just like in default Array.sort) - naturalComparator is used by default
 *
 * example: header = [
 *                      "First Header",
 *                      { cellValue: "Second header", sortable: false},
 *                      { cellValue: "Third Header", columnClassName: "column--third"},
 *                      { cellValue: "Fourth Header", className: "header--bold"},
 *                  ]
 *
 * @param {Array} props.data is an Array of Objects. Each object represents a single row. Each row should have 'cells' attribute,
 * where the array of cells data is located. When the table is expandable, rows might have the children's data located under
 * "children" attribute. "children" should be an Array of children rows. Each cell data might be either an Object or a string.
 * When it is an Object, ir might contain following keys :
 * @param {String} className - adds className to the cell
 * @param {String|Number} cellValue - displayed value
 *
 * example: data = [
 *                      {
 *                          cells: ["!", "50", { cellValue: "Test", className: "cell--special"}]
 *                      },
 *                      {
 *                          cells: ["2", "abc", { cellValue: "Test", className: "cell--special--haschildren"}]
 *                          children: [
 *                                       {
 *                                           cells: ["child", "first", { cellValue: "child", className: "child"}]
 *                                       },
 *                                       {
 *                                           cells: ["Second", "child", { cellValue: "child", className: "child--2"}]
 *                                       }
 *                          ]
 *                      },
 *                  ]
 *
 * @param {Function} rowComponent when provided, will be used as a table row Component, that should display props.children
 * by default ./table/Row.js is used as a rowComponent
 *
 * @param {Function} cellComponent when provided, will be used as a table row Component, that should display props.children
 * by default ./table/Cell.js is used as a cellComponent
 *
 * @param {Boolean} isExpandable when set to true, column with expand toggle buttons will appear. When row is expanded,
 * @param {Boolean} isLoading when set to true, no data message will not be shown when data is empty,
 *
 * @param {Function} onCellClick cell onClick callback (gets also triggered on "Enter" keydown event)
 * callback - (event, data) => { ... }
 * data is an object. It contains cellData, cellId, rowData, rowId
 *
 * @param {Function} onCellContextMenu cell onContextMenu callback
 * callback - (event, data) => { ... }
 * data is an object. It contains cellData, cellId, rowData, rowId
 *
 * @param {String} noDataMessage - message displayed when there is no data
 * @param {String} className - table className
 * @return {Object} Table Component
 *
 * Extended table functionalities are described in ./table/TableToolkitProvider.js
 */

const Table = props => {
    const tableBodyWrapRef = useRef();
    const tableFocusAnchorRef = useRef();
    const dimensions = useResizeObserver(tableBodyWrapRef);
    const [tableHeight, setTableHeight] = useState();
    const [scrollBarSize, setScrollBarSize] = useState(0);
    const [focusedRowId, setFocusedRowId] = useState(0);
    const [focusedChildrenRowId, setFocusedChildrenRowId] = useState(null);
    const [focusedCellId, setFocusedCellId] = useState(0);
    const [isHeaderFocused, setIsHeaderFocused] = useState(false);
    const [isBodyFocused, setIsBodyFocused] = useState(false);
    const [maxFocusedCellId, setMaxFocusedCellId] = useState(0);
    const shouldBlockKeyDownRef = useRef();

    const RowComponent = getTableRowComponent(props.rowComponent);
    const CellComponent = getTableCellComponent(props.cellComponent);

    useEffect(() => {
        const isTableFocusable =
            props.isSortable || props.isExpandable || props.onCellClick != null || props.onCellContextMenu != null;
        if (!isTableFocusable) {
            return;
        }

        // column is appended at the beggining of the table when it is expandable
        setMaxFocusedCellId(props.isExpandable ? props.header.length : props.header.length - 1);
    }, [props]);

    useEffect(() => {
        if (!isBodyFocused) {
            return;
        }

        setIsHeaderFocused(false);
    }, [isBodyFocused]);

    useEffect(() => {
        if (!isHeaderFocused) {
            return;
        }

        setIsBodyFocused(false);
    }, [isHeaderFocused]);

    useEffect(() => {
        if (!props.sizeByData) {
            return setTableHeight(null);
        }

        setTableHeight(getTableHeight(props.data, props.defaultRowHeight));
    }, [props.sizeByData, props.data, props.defaultRowHeight]);

    // determines whether user can click on cells / focus the table
    const isBodyFocusable =
        props.data.length && (props.isExpandable || props.onCellClick != null || props.onCellContextMenu != null);

    const handleHeaderKeyDown = ev => {
        if (!isHeaderFocused) {
            return;
        }

        if (shouldBlockKeyDownRef.current) {
            return;
        }

        // everytime keyDown is triggered, block the next trigger from happening for 100 ms
        shouldBlockKeyDownRef.current = true;
        setTimeout(() => {
            shouldBlockKeyDownRef.current = false;
        }, 100);

        switch (ev.keyCode) {
            case 39: // "ArrowRight"
                setFocusedCellId(prevState => {
                    if (maxFocusedCellId === prevState) {
                        return prevState;
                    }

                    return prevState + 1;
                });
                return;
            case 37: // "ArrowLeft"
                setFocusedCellId(prevState => {
                    if (prevState === 0) {
                        return prevState;
                    }

                    return prevState - 1;
                });
                return;
            case 13: // "Enter"
                const currentHeaderCellId = props.isExpandable ? focusedCellId - 1 : focusedCellId;
                if (props.header[currentHeaderCellId] == null) {
                    return;
                }
                currentHeaderCellId >= 0 &&
                    props.handleHeaderClick &&
                    props.handleHeaderClick(ev, props.header[currentHeaderCellId], currentHeaderCellId);
                return;
            default:
                return;
        }
    };

    const handleHeaderClick = (head, i) => {
        return ev => {
            // remove focus from the table body
            const currentFocusedCellId = props.isExpandable ? i + 1 : i;
            setFocusedCellId(currentFocusedCellId);
            setFocusedRowId(0);
            setFocusedChildrenRowId(null);
            props.handleHeaderClick && props.handleHeaderClick(ev, head, i);
        };
    };

    const handleBodyKeyDown = ev => {
        if (!isBodyFocused) {
            return;
        }

        if (shouldBlockKeyDownRef.current) {
            return;
        }

        // everytime keyDown is triggered, block the next trigger from happening for 100 ms
        shouldBlockKeyDownRef.current = true;
        setTimeout(() => {
            shouldBlockKeyDownRef.current = false;
        }, 100);

        switch (ev.keyCode) {
            case 39: {
                // "ArrowRight"
                if (maxFocusedCellId <= focusedCellId) {
                    return;
                }
                setFocusedCellId(focusedCellId + 1);
                return;
            }

            case 37: {
                // "ArrowLeft"
                const isWithinChildren = focusedChildrenRowId != null;

                const shouldDoNothing = focusedCellId <= (isWithinChildren ? 1 : 0);
                if (shouldDoNothing) {
                    return;
                }
                setFocusedCellId(focusedCellId - 1);
                return;
            }
            case 40: {
                // "ArrowDown"
                const isWithinChildren = focusedChildrenRowId != null;
                const currentRowData = props.data[focusedRowId];
                if (currentRowData == null) {
                    return;
                }

                const shouldMoveToTheNextChildren =
                    isWithinChildren && focusedChildrenRowId < currentRowData.children.length - 1;
                if (shouldMoveToTheNextChildren) {
                    return setFocusedChildrenRowId(focusedChildrenRowId + 1);
                }

                const shouldGoIntoTheChildrenRows =
                    !isWithinChildren && currentRowData.isExpanded === true && currentRowData.children.length;
                if (shouldGoIntoTheChildrenRows) {
                    focusedCellId === 0 && setFocusedCellId(1); // children rows do not have the expand cell
                    return setFocusedChildrenRowId(0);
                }

                // focus is on the last row, which is not expanded / does not have children
                // if it had children &&  was expanded, previous condition would be true
                const shouldDoNothing = focusedRowId >= props.data.length - 1;
                if (shouldDoNothing) {
                    return;
                }

                const shouldLeaveCurrentChildren = isWithinChildren;
                if (shouldLeaveCurrentChildren) {
                    setFocusedChildrenRowId(null);
                }
                setFocusedRowId(focusedRowId + 1);
                return;
            }

            case 38: {
                // "ArrowUp"

                const isWithinChildren = focusedChildrenRowId != null;
                const shouldMoveToThePreviousChildren = isWithinChildren && focusedChildrenRowId > 0;
                if (shouldMoveToThePreviousChildren) {
                    return setFocusedChildrenRowId(focusedChildrenRowId - 1);
                }

                const shouldLeaveCurrentChildren = isWithinChildren;
                if (shouldLeaveCurrentChildren) {
                    return setFocusedChildrenRowId(null);
                }

                const shouldDoNothing = focusedRowId === 0;
                if (shouldDoNothing) {
                    return;
                }
                const previousRowData = props.data[focusedRowId - 1];
                if (previousRowData == null) {
                    return;
                }

                const shouldGoIntoTheChildrenRows =
                    previousRowData.isExpanded === true && previousRowData.children.length;
                if (shouldGoIntoTheChildrenRows) {
                    focusedCellId === 0 && setFocusedCellId(1); // children rows do not have the expand cell
                    setFocusedChildrenRowId(previousRowData.children.length - 1);
                }
                // no need to setFocusedChildrenRowId(null) here, since we know it is not within children -> it is null

                setFocusedRowId(focusedRowId - 1);
                return;
            }

            case 13: {
                // "Enter"
                const currentRowData = props.data[focusedRowId];
                if (currentRowData == null) {
                    return;
                }

                const shouldExpandRow =
                    props.isExpandable &&
                    currentRowData.blockExpand !== true &&
                    (focusedCellId === 0 || (props.onCellClick == null && props.onCellContextMenu == null));

                if (shouldExpandRow) {
                    return currentRowData.toggleExpand && currentRowData.toggleExpand(ev);
                }

                const isEnterEventWorking = props.onCellClick != null || props.onCellContextMenu != null;
                if (!isEnterEventWorking) {
                    return;
                }

                const currentBodyCellId = props.isExpandable ? focusedCellId - 1 : focusedCellId;
                if (currentRowData.cells[currentBodyCellId] == null) {
                    return console.error('Invalid Data');
                }

                const eventData = {
                    rowData: currentRowData,
                    rowId: focusedRowId,
                    cellData: currentRowData.cells[currentBodyCellId],
                    cellId: currentBodyCellId
                };

                if (props.onCellClick) {
                    return props.onCellClick(ev, eventData);
                }

                props.onCellContextMenu(ev, eventData);
                return;
            }
            default:
                return;
        }
    };

    /**
     * Set focus class to the clicked cell, if the table is 'clickable'
     * @param {Object} data - data of the targetted cell
     * @param {Boolean} isExpandCell
     * @param {Boolean} isChildren
     */
    const focusCurrentlyTargettedCell = (data, isExpandCell, isChildren) => {
        if (!isBodyFocused) {
            // using .focus instead of setIsBodyFocused so current active element withing the dom loses its focus
            tableFocusAnchorRef.current.focus();
        }
        if (isChildren) {
            // children row cells are shifted and start from 2nd cell
            // so actually cellId + 1 was clicked
            setFocusedCellId(data.cellId + 1);
            setFocusedRowId(data.parentRowId);
            setFocusedChildrenRowId(data.rowId);
            return;
        }

        if (focusedChildrenRowId != null) {
            setFocusedChildrenRowId(null);
        }

        const clickedCellId = isExpandCell ? 0 : props.isExpandable ? data.cellId + 1 : data.cellId;
        setFocusedCellId(clickedCellId);
        setFocusedRowId(data.rowId);
    };

    /**
     * This function is wrapping the callbacks provided by the user to set correct focus state within the table
     * and trigger `expand` if the click callback is not provided
     * @param {Object} event
     * @param {Object} data
     * @param {Boolean} isExpandCell
     * @param {Boolean} isChildren
     */
    const handleCellClick = (event, data, isExpandCell, isChildren) => {
        event.preventDefault(); // has to be here so focus stays on the table

        focusCurrentlyTargettedCell(data, isExpandCell, isChildren);
        if (isExpandCell) {
            return;
        }
        if (props.onCellClick) {
            return props.onCellClick(event, data);
        }

        if (isChildren) {
            return;
        }

        const currentRowData = props.data[data.rowId];
        const shouldExpandRow = props.isExpandable && currentRowData.blockExpand !== true;

        if (shouldExpandRow) {
            return currentRowData.toggleExpand && currentRowData.toggleExpand(event);
        }
    };

    /**
     * This function is wrapping the callbacks provided by the user to set correct focus state within the table
     * @param {Object} event
     * @param {Object} data
     * @param {Boolean} isExpandCell
     * @param {Boolean} isChildren
     */
    const handleCellContextMenu = (event, data, isExpandCell, isChildren) => {
        focusCurrentlyTargettedCell(data, isExpandCell, isChildren);
        props.onCellContextMenu && props.onCellContextMenu(event, data);
    };

    let tableClassName = CLASS_NAMES.TABLE;
    if (props.className) {
        tableClassName += ` ${props.className}`;
    }
    if (props.sizeByData) {
        tableClassName += ` ${CLASS_NAMES.SIZED_TABLE}`;
    }

    const tableStyle = {};
    if (tableHeight) {
        tableStyle.height = `${tableHeight}px`;
    }

    return (
        <div style={tableStyle} className={tableClassName}>
            <Header
                header={props.header}
                RowComponent={RowComponent}
                CellComponent={CellComponent}
                scrollBarSize={scrollBarSize}
                sortBy={props.sortBy}
                sortDir={props.sortDir}
                isExpandable={props.isExpandable}
                focusedCellId={focusedCellId}
                isSortable={props.isSortable}
                handleHeaderClick={handleHeaderClick}
                isFocused={isHeaderFocused}
                handleHeaderFocus={() => setIsHeaderFocused(true)}
                handleHeaderBlur={() => setIsHeaderFocused(false)}
                handleHeaderKeyDown={handleHeaderKeyDown}
            />
            <div
                ref={tableFocusAnchorRef}
                className={CLASS_NAMES.BODY_FOCUS_ANCHOR}
                tabIndex={isBodyFocusable ? '0' : '-1'}
                onFocus={() => setIsBodyFocused(true)}
                onBlur={() => setIsBodyFocused(false)}
                onKeyDown={handleBodyKeyDown}
            ></div>
            <div ref={tableBodyWrapRef} className={CLASS_NAMES.BODY_WRAP}>
                {dimensions && (
                    <Body
                        width={dimensions.width}
                        height={dimensions.height}
                        setScrollBarSize={setScrollBarSize}
                        data={props.data}
                        isLoading={props.isLoading}
                        noDataMessage={props.noDataMessage}
                        header={props.header}
                        focusedCellId={focusedCellId}
                        focusedRowId={focusedRowId}
                        focusedChildrenRowId={focusedChildrenRowId}
                        isFocused={isBodyFocused}
                        isExpandable={props.isExpandable}
                        RowComponent={RowComponent}
                        CellComponent={TableBodyCellComponentWrapper(
                            handleCellClick,
                            handleCellContextMenu,
                            isBodyFocusable,
                            CellComponent
                        )}
                    />
                )}
            </div>
        </div>
    );
};

Table.propTypes = {
    header: PropTypes.array,
    handleHeaderClick: PropTypes.func,
    data: PropTypes.array,
    sortDir: PropTypes.string,
    sortBy: PropTypes.number,
    isExpandable: PropTypes.bool,
    isSortable: PropTypes.bool,
    isLoading: PropTypes.bool,
    rowComponent: PropTypes.object,
    cellComponent: PropTypes.object,
    noDataMessage: PropTypes.string,
    className: PropTypes.string,
    sizeByData: PropTypes.bool,
    defaultRowHeight: PropTypes.number
};

Table.defaultProps = {
    header: [],
    data: [],
    noDataMessage: DEFAULT_NO_DATA_MESSAGE
};

export { TimeRangeSelector, SearchBar, TableActionsRow, ExportPanel, TableToolkitProvider };

export default Table;
