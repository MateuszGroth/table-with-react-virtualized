import React from 'react';
import PropTypes from 'prop-types';

import { CLASS_NAMES } from './constant';

const ExportPanel = props => {
    return (
        <div className={`${CLASS_NAMES.EXPORT_PANEL}${props.className ? ` ${props.className}` : ''}`}>
            <span
                className={`${CLASS_NAMES.EXPORT_ACTION} ${CLASS_NAMES.EXPORT_BUTTON} action__export`}
                onClick={() => props.handleExportClick && props.handleExportClick()}
                tabIndex="0"
                title="Export"
                aria-label="Export"
            >
                Export
            </span>
            <span
                className={`${CLASS_NAMES.EXPORT_ACTION} ${CLASS_NAMES.PRINT_BUTTON} action__print`}
                title="Print"
                aria-label="Print"
                onClick={() => props.handlePrintClick && props.handlePrintClick()}
                tabIndex="0"
            >
                Print
            </span>
        </div>
    );
};
ExportPanel.propTypes = {
    handleExportClick: PropTypes.func,
    handlePrintClick: PropTypes.func
};

export default ExportPanel;
