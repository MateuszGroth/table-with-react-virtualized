const CLASS_NAMES = {
    TABLE: `virt-table`,
    SIZED_TABLE: `virt-table--sized`,
    EXPAND_CELL: `virt-table__expand-cell`,
    SMALL_CELL: `virt-table__cell--sm`,
    FOCUS_CELL: `virt-table__cell--focus`,
    POINTER_CELL: `virt-table__cell--point`,
    HEADER: `virt-table__header`,
    HEADER_CELL: `virt-table__cell--head`,
    SORTED_HEADER_CELL: 'virt-table__cell--sort-head',
    CELL: `virt-table__cell`,
    ROW: `virt-table__row`,
    NO_DATA_ROW: `virt-table__row--nodata`,
    BODY: `virt-table__body`,
    BODY_WRAP: `virt-table__body-wrap`,
    CHILDREN_ROW: 'virt-table__children-row',
    CHILDREN_CONT: 'virt-table__children-cont',
    EVEN_ROW: `virt-table__row--even`,
    EXPANDED_ROW: `virt-table__row--expanded`,
    SEARCH_CONT: `virt-table__search-cont`,
    SEARCH_CLEAR: `virt-table__search-clear`,
    SORTED_HEADER_SPAN: `virt-table__sort-anch`,
    ACTIONS_ROW: `virt-table__actions-row`,
    EXPORT_PANEL: `virt-table__export-cont`,
    EXPORT_ACTION: `virt-table__export-action`,
    EXPORT_BUTTON: `virt-table__export-btn`,
    PRINT_BUTTON: `virt-table__export-btn`,
    PARENT_ROW_WRAP: `virt-table__parent-row`,
    DATE_RANGE_CONT: `virt-table__date-cont`,
    DATE_RANGE_INVALID: `virt-table__date--invalid`,
    DATE_RANGE_FOCUS: `virt-table__date--focus`,
    DATE_RANGE_CLEAR: `virt-table__date-clear`,
    DATE_RANGE_LABEL: `virt-table__date-label`,
    DATE_RANGE_LABEL_START: `virt-table__date-label--start`,
    DATE_RANGE_LABEL_END: `virt-table__date-label--end`,
    DATE_PICKER_CONT: `virt-table__date-picker-cont`,
    DATE_PICKER_WRAP: `virt-table__date-picker-wrap`,
    DATE_PICKER_INVALID: `virt-table__date-picker--invalid`,
    DATE_PICKER_FOCUS: `virt-table__date-picker--focus`,
    DATE_PICKER: `virt-table__date-picker`,
    CLEAR: `virt-table__clear`,
    BODY_FOCUS_ANCHOR: `virt-table__body-focus-anch`
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
