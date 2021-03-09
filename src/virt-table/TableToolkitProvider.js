import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
    sortTableItems,
    filterDataByText,
    filterDataByDate,
    parseDataForExports,
    printTable,
    exportCsv
} from './helper';

/**
 * Table Toolkit Provider
 * Adds functionalities to the Virtual Table, such as:
 * filtering, exporting data, sorting
 * 
 * @param ({
 *  initialSortBy,
 *  initialSortDir,
 *  isFilterEnabled,
 *  initialFilterText,
 *  isExportable,
 *  exportedFileName,
 *  isSortable,
 *  isTimeRangeSelectorEnabled,
 *  isClearTimeRangeHidden,
 *  prepareExportData,
 *  preparePrintData
 *  ...TableProps
 * })
 * @param {Boolean} isSortable - enables sorting
 * @param {Boolean} isTimeRangeSelectorEnabled - enables filtering by date
 * @param {Boolean} isClearTimeRangeHidden - hides clear selected dates button
 * @param {Number} initialSortBy - index of initialy sorted column
 * @param {String} initialSortDir - initial sort dir - 'asc' or 'desc'
 * @param {Boolean} isFilterEnabled - enables filter (have to use utility component, such as SearchBar, or create a custom one)
 * @param {Boolean} isTimeRangeSelectorEnabled - enables filter (have to use utility component, such as TimeRangeSelector, or create a custom one)
 * @param {Date} initialStartDate - initial start date when time range selector enabled
 * @param {Date} initialEndDate - initial end date when time range selector enabled
 * @param {String} initialFilterText - initial search text
 * @param {Boolean} isExportable - enables data export (have to use utility component, such as ExportPanel, or create a custom one)
 * @param {String} exportedFileName - title of the printed page and/or file name of the exported csv
 * @param {Function} prepareExportData - callback that if provided, gets called before exporting the data. Exported file will contain the outcome of that callback
 * arguments this callback receives are: (header, data, isExpandable) 
 * @param {Function} preparePrintData - callback that if provided, gets called before printing the data. Printed file will contain the outcome of that callback
 * arguments this callback receives are: (header, data, isExpandable)  
 * TableProps - props that Table might reveice
 * 
 * When toolkit provider is used, table component (along with the other utility components)
 * should be passed within a children (props.children) of the toolkit provider and reveice props from that toolkit,
 * instead of passing props directly to the table/utility components.
 * 
 * example
 *      instead of: 
 *          <Table
                header={header}
                data={data}
                isExpandable={true}
            />
        
        do:
            <TableToolkitProvider
                header={header}
                data={data}
                isSortable={true}
                isExpandable={true}
                isExportable={true}
                isFilterEnabled={true}
                isClearFilterHidden={true}
            >
                {toolkitProps => (
                    <Fragment>
                        <TableActionsRow>
                            <SearchBar {...toolkitProps} />
                            <ExportPanel {...toolkitProps} />
                        </TableActionsRow>
                        <Table {...toolkitProps} />
                    </Fragment>
                )}
            </TableToolkitProvider>

    or if no utility components (such as TableActionsRow, SearchBar, etc.) are used, 
    you can simply do:

              <TableToolkitProvider
                header={header}
                data={data}
                isSortable={true}
                isExpandable={true}
                isExportable={true}
                isFilterEnabled={true}
                isClearFilterHidden={true}
            >
                {Table}
            </TableToolkitProvider>       
 *
 */
const TableToolkitProvider = ({
    initialSortBy,
    initialSortDir,
    isFilterEnabled,
    initialFilterText,
    initialStartDate,
    initialEndDate,
    onFilterChange,
    isExportable,
    isTimeRangeSelectorEnabled,
    onDateChange,
    children: Children,
    ...props
}) => {
    const [filterText, setFilterText] = useState('');
    const [data, setData] = useState([]); // used when filter is disabled and as a base to filter data
    const [tableData, setTableData] = useState([]); // used when filter is enabled
    const [sortBy, setSortBy] = useState();
    const [sortDir, setSortDir] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    useEffect(() => {
        if (!props.isSortable) {
            return setSortBy(null);
        }
        setSortBy(initialSortBy);
        setSortDir(initialSortDir);
    }, [initialSortDir, initialSortBy, props.isSortable]);

    useEffect(() => {
        if (!isFilterEnabled) {
            return setFilterText('');
        }

        if (initialFilterText == null) {
            return;
        }
        setFilterText(initialFilterText);
    }, [initialFilterText, isFilterEnabled]);

    useEffect(() => {
        if (!isTimeRangeSelectorEnabled) {
            setStartDate(null);
            return;
        }

        setStartDate(initialStartDate);
    }, [initialStartDate, isTimeRangeSelectorEnabled]);

    useEffect(() => {
        if (!isTimeRangeSelectorEnabled) {
            setEndDate(null);
            return;
        }

        setEndDate(initialEndDate);
    }, [initialEndDate, isTimeRangeSelectorEnabled]);

    useEffect(() => {
        if (typeof props.data !== 'object' || !props.data.length) {
            return setData([]);
        }
        if (sortBy == null || props.header[sortBy] == null || props.header[sortBy].sortable === false) {
            return setData(props.data);
        }
        setData(sortTableItems(props.data, sortBy, sortDir, props.header[sortBy].sortFunc));
    }, [props.data, sortBy, sortDir, props.header]);

    useEffect(() => {
        if (!isFilterEnabled && !isTimeRangeSelectorEnabled) {
            return;
        }
        if (data == null) {
            return setTableData([]);
        }

        let tmpData = data;

        const shouldFilterByDate = isTimeRangeSelectorEnabled && (startDate != null || endDate != null);
        if (shouldFilterByDate) {
            tmpData = filterDataByDate(tmpData, startDate, endDate);
        }

        const shouldFilterByText = isFilterEnabled && !!filterText;
        if (shouldFilterByText) {
            tmpData = filterDataByText(tmpData, filterText);
        }

        setTableData(tmpData);
    }, [data, filterText, isFilterEnabled, isTimeRangeSelectorEnabled, startDate, endDate]);

    const handleHeaderClick = useCallback(
        (ev, head, i) => {
            if (!props.isSortable) {
                return;
            }
            if (head.sortable === false) {
                return;
            }

            if (sortBy === i) {
                return setSortDir(prevDir => (prevDir === 'asc' ? 'desc' : 'asc'));
            }

            setSortBy(i);
        },
        [sortBy, props.isSortable]
    );

    const getHandleExportCallback = (callback, isPrint, processDataCallback = null) => () => {
        const dataForExport = (processDataCallback || parseDataForExports(isPrint))(
            props.header,
            isFilterEnabled ? tableData : data,
            props.isExpandable
        );
        callback(dataForExport, props.exportedFileName);
    };

    const tableProps = { ...props, data: isFilterEnabled || isTimeRangeSelectorEnabled ? tableData : data };

    if (isFilterEnabled) {
        tableProps.handleFilterChange = newValue => {
            setFilterText(newValue);
            if (!onFilterChange) {
                return;
            }
            onFilterChange(newValue);
        };
        tableProps.filterText = filterText;
    }

    if (props.isSortable) {
        tableProps.handleHeaderClick = handleHeaderClick;
        tableProps.sortBy = sortBy;
        tableProps.sortDir = sortDir;
    }

    if (isExportable) {
        tableProps.handleExportClick = getHandleExportCallback(exportCsv, false, props.prepareExportData);
        tableProps.handlePrintClick = getHandleExportCallback(printTable, true, props.preparePrintData);
    }

    if (isTimeRangeSelectorEnabled) {
        tableProps.startDate = startDate;
        tableProps.endDate = endDate;
        tableProps.handleStartDateChange = date => {
            setStartDate(date);
            if (!onDateChange) {
                return;
            }
            onDateChange(date, endDate);
        };
        tableProps.handleEndDateChange = date => {
            setEndDate(date);
            if (!onDateChange) {
                return;
            }
            onDateChange(startDate, date);
        };
        tableProps.handleTimeClearClick = props.isClearTimeRangeHidden
            ? null
            : () => {
                  setStartDate(initialStartDate);
                  setEndDate(initialEndDate);
                  if (!onDateChange) {
                      return;
                  }
                  onDateChange(initialStartDate, initialEndDate);
              };

        tableProps.isClearDateDisabled =
            props.isClearTimeRangeHidden || (startDate === initialStartDate && endDate === initialEndDate);
    }

    return <Children {...tableProps} />;
};

TableToolkitProvider.propTypes = {
    header: PropTypes.array,
    data: PropTypes.array,
    initialFilterText: PropTypes.string,
    exportedFileName: PropTypes.string,
    initialSortDir: PropTypes.string,
    initialSortBy: PropTypes.number,
    initialStartDate: PropTypes.instanceOf(Date),
    initialEndDate: PropTypes.instanceOf(Date),
    isExpandable: PropTypes.bool,
    isFilterEnabled: PropTypes.bool,
    isTimeRangeSelectorEnabled: PropTypes.bool,
    isSortable: PropTypes.bool,
    onDateChange: PropTypes.func,
    prepareExportData: PropTypes.func,
    preparePrintData: PropTypes.func,
    onFilterChange: PropTypes.func
};

export default TableToolkitProvider;
