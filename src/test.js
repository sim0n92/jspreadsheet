import jspreadsheet from './index.js';

import './jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

window.jss = jspreadsheet;

window.instance = jspreadsheet(document.getElementById('root'), {
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
