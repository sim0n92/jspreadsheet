/**
 * Auto-calculate column widths based on table max width
 */
export const applyAutoWidth = function () {
    const obj = this;

    if (!obj.options.worksheetWidth || !obj.options.rowHeaderWidth) {
        return;
    }

    const tableMaxWidth = parseInt(obj.options.worksheetWidth);
    const rowHeaderWidth = parseInt(obj.options.rowHeaderWidth);
    const numberOfColumns = obj.options.columns ? obj.options.columns.length : 0;

    if (!numberOfColumns) {
        return;
    }

    // Calculate available width for data columns
    const availableWidth = tableMaxWidth - rowHeaderWidth;
    const columnWidth = Math.floor(availableWidth / numberOfColumns);

    // Apply width to row header column (first td in each row)
    const firstColStyle = `
        .jss_worksheet > tbody > tr > td:first-child {
            width: ${rowHeaderWidth}px !important;
            min-width: ${rowHeaderWidth}px !important;
            max-width: ${rowHeaderWidth}px !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
        }

        .jss_worksheet > colgroup > col:first-child {
            width: ${rowHeaderWidth}px !important;
        }

        .jss_worksheet {
            width: ${tableMaxWidth}px !important;
            table-layout: fixed !important;
        }
    `;

    // Check if style element already exists
    let styleElement = obj.element.querySelector('#jss-auto-width-style');

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'jss-auto-width-style';
        obj.element.appendChild(styleElement);
    }

    styleElement.textContent = firstColStyle;

    // Apply width to each data column
    if (obj.colgroup && obj.colgroup.children) {
        // Skip first column (row header)
        for (let i = 1; i < obj.colgroup.children.length; i++) {
            obj.colgroup.children[i].setAttribute('width', columnWidth);
        }
    }

    // Update column definitions
    if (obj.options.columns) {
        obj.options.columns.forEach((column) => {
            column.width = columnWidth;
        });
    }
};
