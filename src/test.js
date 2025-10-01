import jspreadsheet from './index.js';

import './jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

window.jss = jspreadsheet;

const root = document.getElementById('root');

// Helper function to create test section
const createSection = (title) => {
    const heading = document.createElement('h3');
    heading.textContent = title;
    heading.style.marginTop = '20px';
    heading.style.marginBottom = '10px';
    root.appendChild(heading);

    const container = document.createElement('div');
    container.style.marginBottom = '30px';
    root.appendChild(container);

    return container;
};

// Test 1: autoWrapRows enabled
window.instance1 = jspreadsheet(createSection('Test 1: autoWrapRows = true (auto resize rows)'), {
    tabs: true,
    toolbar: true,
    worksheets: [
        {
            minDimensions: [6, 6],
            autoWrapRows: true,
            data: [
                ['Short', 'This is a very long text that should wrap into multiple lines automatically when autoWrapRows is enabled', 'Normal'],
                ['A', 'B', 'C'],
                ['Test', 'Another very long text with lots of content that needs to be displayed in multiple lines because it does not fit in one line', 'End'],
            ],
            columns: [
                { type: 'text', title: 'Column A', width: 100 },
                { type: 'text', title: 'Column B', width: 300 },
                { type: 'text', title: 'Column C', width: 100 },
                { type: 'text', title: 'Column D', width: 120 },
                { type: 'text', title: 'Column E', width: 120 },
                { type: 'text', title: 'Column F', width: 120 },
            ],
        },
    ],
});

// Test 2: wordWrap only (no auto resize)
window.instance2 = jspreadsheet(createSection('Test 2: wordWrap = true (manual resize only)'), {
    tabs: true,
    toolbar: true,
    worksheets: [
        {
            minDimensions: [6, 6],
            wordWrap: true,
            data: [
                ['Short', 'This is a very long text that should wrap but will NOT auto-resize', 'Normal'],
                ['A', 'B', 'C'],
                ['Test', 'You need to manually resize rows here', 'End'],
            ],
            columns: [
                { type: 'text', title: 'Column A', width: 100 },
                { type: 'text', title: 'Column B', width: 300 },
                { type: 'text', title: 'Column C', width: 100 },
                { type: 'text', title: 'Column D', width: 120 },
                { type: 'text', title: 'Column E', width: 120 },
                { type: 'text', title: 'Column F', width: 120 },
            ],
        },
    ],
});
