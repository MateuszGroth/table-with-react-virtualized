import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { CLASS_NAMES } from './constant';
import Context from './context';

const ExportPanel = defaultProps => {
    const contextProps = useContext(Context);
    const [shouldUseContext] = useState(contextProps.shouldUseContext);
    const props = shouldUseContext ? contextProps : defaultProps;

    return (
        <div className={`${CLASS_NAMES.EXPORT_PANEL}${defaultProps.className ? ` ${defaultProps.className}` : ''}`}>
            <span
                className={`${CLASS_NAMES.EXPORT_ACTION} ${CLASS_NAMES.EXPORT_BUTTON} action__export`}
                onClick={() => props.handleExportClick && props.handleExportClick()}
                onKeyDown={evt => evt.key === 'Enter' && props.handleExportClick && props.handleExportClick()}
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
                onKeyDown={evt => evt.key === 'Enter' && props.handlePrintClick && props.handlePrintClick()}
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
