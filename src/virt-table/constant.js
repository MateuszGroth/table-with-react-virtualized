const CLASS_NAMES = {
    TABLE: `tbl`,
    SIZED_TABLE: `tbl--sized`,
    EXPAND_CELL: `tbl__expand-cell`,
    SMALL_CELL: `tbl__cell--sm`,
    FOCUS_CELL: `tbl__cell--focus`,
    POINTER_CELL: `tbl__cell--point`,
    HEADER: `tbl__header`,
    HEADER_CELL: `tbl__cell--head`,
    SORTED_HEADER_CELL: 'tbl__cell--sort-head',
    CELL: `tbl__cell`,
    ROW: `tbl__row`,
    FOCUSABLE_ROW: `tbl__row--focusable`,
    NO_DATA_ROW: `tbl__row--nodata`,
    BODY: `tbl__body`,
    BODY_WRAP: `tbl__body-wrap`,
    CHILDREN_ROW: 'tbl__children-row',
    CHILDREN_CONT: 'tbl__children-cont',
    EVEN_ROW: `tbl__row--even`,
    EXPANDED_ROW: `tbl__row--expanded`,
    SEARCH_CONT: `tbl__search-cont`,
    SEARCH_CLEAR: `tbl__search-clear`,
    SORTED_HEADER_SPAN: `tbl__sort-anch`,
    ACTIONS_ROW: `tbl__actions-row`,
    EXPORT_PANEL: `tbl__export-cont`,
    EXPORT_ACTION: `tbl__export-action`,
    EXPORT_BUTTON: `tbl__export-btn`,
    PRINT_BUTTON: `tbl__export-btn`,
    PARENT_ROW_WRAP: `tbl__parent-row`,
    DATE_RANGE_CONT: `tbl__date-cont`,
    DATE_RANGE_INVALID: `tbl__date--invalid`,
    DATE_RANGE_FOCUS: `tbl__date--focus`,
    DATE_RANGE_CLEAR: `tbl__date-clear`,
    DATE_RANGE_LABEL: `tbl__date-label`,
    DATE_RANGE_LABEL_START: `tbl__date-label--start`,
    DATE_RANGE_LABEL_END: `tbl__date-label--end`,
    DATE_PICKER_CONT: `tbl__date-picker-cont`,
    DATE_PICKER_WRAP: `tbl__date-picker-wrap`,
    DATE_PICKER_INVALID: `tbl__date-picker--invalid`,
    DATE_PICKER_FOCUS: `tbl__date-picker--focus`,
    DATE_PICKER: `tbl__date-picker`,
    CLEAR: `tbl__clear`,
    BODY_FOCUS_ANCHOR: `tbl__body-focus-anch`,
    BODY_NOT_VIRTUAL: `tbl__body--no-virtual`,
    BODY_VIRTUAL: `tbl__body--virtual`
};

const HEADER_ATTRIBUTES = {
    COLUMN_CLASSNAME: 'columnClassName',
    COLUMN_FORMATTER: 'columnFormatter',
    COLUMN_VALUE_FORMATTER: 'columnValueFormatter',
    COLUMN_WIDTH: 'columnWidth'
};

const DEFAULT_NO_DATA_MESSAGE = 'No data to display';
const DEFAULT_ROW_HEIGHT = 40;

export { CLASS_NAMES, HEADER_ATTRIBUTES, DEFAULT_NO_DATA_MESSAGE, DEFAULT_ROW_HEIGHT };
