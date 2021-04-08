import React, { useRef, useEffect, useCallback } from 'react';

import List from 'react-virtualized/dist/commonjs/List';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';

import BodyParentRow from './BodyParentRow';
import BodyRow from './BodyRow';

import { CLASS_NAMES } from './constant';

const Body = props => {
    const tableBodyRef = useRef();
    const cache = useRef(
        props.virtual
            ? new CellMeasurerCache({
                  fixedWidth: true,
                  defaultHeight: 100
              })
            : null
    );

    const updateScrollBarSize = useCallback(() => {
        // function gets called everytime props (including data) / tableBodyRef changes and on row expand toggle

        if (tableBodyRef.current == null) {
            return;
        }

        // wait until component rerenders
        // otherwise verticalScrollBarSize is not updated,
        requestAnimationFrame(() => {
            if (tableBodyRef.current == null) {
                return;
            }

            if (props.virtual) {
                props.setScrollBarSize(tableBodyRef.current.Grid._verticalScrollBarSize);
                return;
            }
            props.setScrollBarSize(tableBodyRef.current.offsetWidth - tableBodyRef.current.clientWidth);
        });
    }, [tableBodyRef, props]);

    useEffect(updateScrollBarSize, [updateScrollBarSize]);

    useEffect(() => {
        if (!props.virtual) {
            return;
        }

        if (tableBodyRef.current == null) {
            return;
        }
        cache.current.clearAll();
        tableBodyRef.current.forceUpdateGrid();
    }, [tableBodyRef, props.data, props.width, props.height, props.virtual]);

    const handleExpandRow = i => {
        if (!props.virtual) {
            return;
        }
        if (tableBodyRef.current == null) {
            return;
        }

        cache.current.clear(i);
        tableBodyRef.current.forceUpdateGrid();
        updateScrollBarSize();
    };

    if (!props.isLoading && !props.data.length) {
        return <div className={CLASS_NAMES.NO_DATA_ROW}>{props.noDataMessage}</div>;
    }

    return props.virtual ? (
        <List
            ref={tableBodyRef}
            className={`${CLASS_NAMES.BODY} ${CLASS_NAMES.BODY_VIRTUAL}`}
            width={props.width}
            height={props.height}
            rowHeight={cache.current.rowHeight}
            deferredMeasurementCache={cache.current}
            tabIndex={-1}
            rowCount={props.data.length}
            // pass scrollToIndex only when needed - it can not take 'null'
            {...(props.isFocused && !isNaN(props.focusedRowId) && props.data.length > props.focusedRowId
                ? { scrollToIndex: props.focusedRowId }
                : {})}
            rowRenderer={({ key, index: rowId, style, parent }) => {
                const rowData = props.data[rowId];
                const rowClassName = rowId % 2 === 0 ? CLASS_NAMES.EVEN_ROW : '';
                const rowProps = {
                    rowData,
                    rowId,
                    RowComponent: props.RowComponent,
                    CellComponent: props.CellComponent,
                    header: props.header,
                    style,
                    handleExpandRow,
                    isExpandable: props.isExpandable,
                    rowClassName,
                    isBodyFocusable: props.isBodyFocusable
                };

                if (props.isFocused && props.focusedRowId === rowId) {
                    rowProps.focusedCellId = props.focusedCellId;
                    rowProps.focusedChildrenRowId = props.focusedChildrenRowId;
                }

                return (
                    <CellMeasurer key={key} cache={cache.current} parent={parent} columnIndex={0} rowIndex={rowId}>
                        {props.isExpandable ? <BodyParentRow {...rowProps} /> : <BodyRow {...rowProps} />}
                    </CellMeasurer>
                );
            }}
        />
    ) : (
        <div ref={tableBodyRef} className={`${CLASS_NAMES.BODY} ${CLASS_NAMES.BODY_NOT_VIRTUAL}`} tabIndex="-1">
            {props.data.map((rowData, rowId) => {
                const rowClassName = rowId % 2 === 0 ? CLASS_NAMES.EVEN_ROW : '';
                const rowProps = {
                    key: rowId,
                    rowData,
                    rowId,
                    RowComponent: props.RowComponent,
                    CellComponent: props.CellComponent,
                    header: props.header,
                    handleExpandRow,
                    isExpandable: props.isExpandable,
                    rowClassName,
                    isBodyFocusable: props.isBodyFocusable
                };

                return props.isExpandable ? <BodyParentRow {...rowProps} /> : <BodyRow {...rowProps} />;
            })}
        </div>
    );
};

export default React.memo(Body);
