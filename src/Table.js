import React from 'react';
import PropTypes from 'prop-types';

import Header from './table/Header';
import Body from './table/Body';
import ActionsBar from './table/ActionsBar';

import { getTableRowComponent, getTableCellComponent } from './table/helper';
/**
 * Table Component
 * @param {{header, body, noDataMessage, rowComponent, cellComponent}} props
 * @param props.header is of type Array. Elements of that array might be either strings or objects
 * object inside the header array might contain following keys :
 * className - adds className to the header cell
 * cellValue - displayed value
 * columnFormatter - function that returns component that will be displayed as the cell of column with id === this header element id
 * columnFormatter => (cellData, rowData, cellId) => ... (this component replaces default TableCell component)
 * columnValueFormatter - function that returns component that will be displayed as the value of cell in column with id === this header element id
 * columnValueFormatter => (cellData, rowData, cellId) => ... (this value will be displayed inside default TableCell component)
 * columnClassName - className that will be added to the table cells with column id === this header obj id
 * (class is not added if columnFormatter is used)
 *
 * @param props.body is of type Array. Elements of that array might be either strings or objects
 * className - adds className to the current table cell
 * value - displayed value
 * className - adds className to the current table cell
 *
 * @param props.rowComponent when provided, will be used as a table row Component, that should display props.children
 *
 * @param props.cellComponent when provided, will be used as a table cell Component, that should display props.children
 *
 * @param props.noDataMessage - message displayed when there is no data
 * @return {Object} Table Component
 */
const Table = props => {
    const RowComponent = getTableRowComponent(props.rowComponent);
    const CellComponent = getTableCellComponent(props.cellComponent);
    return (
        <div className="r-table__wrap">
            <ActionsBar />
            <div className="r-table">
                <Header
                    header={props.header}
                    isExpandable={props.isExpandable}
                    RowComponent={RowComponent}
                    CellComponent={CellComponent}
                />
                <Body {...props} RowComponent={RowComponent} CellComponent={CellComponent} />
            </div>
        </div>
    );
};

Table.propTypes = {
    header: PropTypes.array,
    data: PropTypes.array,
    noDataMessage: PropTypes.string,
    isExportable: PropTypes.bool,
    isExpandable: PropTypes.bool
};

Table.defaultProps = {
    header: [],
    data: []
};

export default React.memo(Table);
