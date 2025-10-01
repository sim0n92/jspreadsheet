# Jspreadsheet CE - NPM Package Build & Usage Guide

## Building as NPM Package

### 1. Verify package.json Configuration

The `package.json` is already configured for NPM publishing:

```json
{
    "name": "jspreadsheet-ce",
    "version": "5.0.4",
    "description": "Jspreadsheet is a lightweight vanilla javascript plugin to create amazing web-based interactive tables and spreadsheets compatible with other spreadsheet software.",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "files": ["dist/", "src/", "README.md", "LICENSE"]
}
```

### 2. Build the Package

```bash
# Install dependencies
npm install

# Build production version
npm run build
```

This creates:

-   `dist/index.js` - Main bundle (UMD format)
-   `dist/jspreadsheet.css` - Core styles
-   `dist/jspreadsheet.themes.css` - Theme styles
-   `dist/index.d.ts` - TypeScript definitions

### 3. Test Local Package (Optional)

Before publishing, test the package locally:

```bash
# In jspreadsheet directory
npm link

# In your Laravel project
cd /path/to/laravel-project
npm link jspreadsheet-ce
```

### 4. Publish to NPM

```bash
# Login to NPM (first time only)
npm login

# Publish the package
npm publish
```

Or publish to a private registry:

```bash
npm publish --registry=https://your-private-registry.com
```

### 5. Version Management

```bash
# Update version (patch/minor/major)
npm version patch  # 5.0.4 -> 5.0.5
npm version minor  # 5.0.4 -> 5.1.0
npm version major  # 5.0.4 -> 6.0.0

# Then publish
npm publish
```

---

## Using in Laravel + Alpine.js + Livewire Project

### Installation

```bash
npm install jspreadsheet-ce jsuites
```

### Option 1: Using with Laravel Mix / Vite (Recommended)

#### 1. Import in your main JavaScript file

**resources/js/app.js:**

```javascript
import jspreadsheet from 'jspreadsheet-ce';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

// Make jspreadsheet globally available
window.jspreadsheet = jspreadsheet;
```

#### 2. Build assets

**For Laravel Mix:**

```bash
npm run dev
# or
npm run production
```

**For Vite:**

```bash
npm run build
```

#### 3. Create Alpine.js Component

**resources/js/components/spreadsheet.js:**

```javascript
export default (config = {}) => ({
    spreadsheet: null,

    init() {
        this.spreadsheet = jspreadsheet(this.$el, {
            tabs: true,
            toolbar: true,
            worksheets: [
                {
                    minDimensions: [10, 10],
                    autoWrapRows: config.autoWrapRows || false,
                    data: config.data || [],
                    columns: config.columns || [],
                    ...config,
                },
            ],
        });
    },

    getData() {
        return this.spreadsheet[0].getData();
    },

    setData(data) {
        this.spreadsheet[0].setData(data);
    },

    destroy() {
        if (this.spreadsheet) {
            jspreadsheet.destroy(this.$el);
        }
    },
});
```

**Register in app.js:**

```javascript
import Alpine from 'alpinejs';
import spreadsheet from './components/spreadsheet';

Alpine.data('spreadsheet', spreadsheet);
Alpine.start();
```

#### 4. Use in Blade Template

**resources/views/components/spreadsheet.blade.php:**

```blade
<div
    x-data="spreadsheet({
        autoWrapRows: {{ $autoWrapRows ?? 'false' }},
        data: @js($data ?? []),
        columns: @js($columns ?? [])
    })"
    x-init="init()"
    class="jspreadsheet-container"
></div>
```

**Usage:**

```blade
<x-spreadsheet
    :data="$spreadsheetData"
    :columns="$spreadsheetColumns"
    :autoWrapRows="true"
/>
```

### Option 2: CDN (Quick Setup)

Add to your Blade layout:

```blade
<!-- In <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspreadsheet-ce/dist/jspreadsheet.css" />

<!-- Before </body> -->
<script src="https://cdn.jsdelivr.net/npm/jsuites/dist/jsuites.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jspreadsheet-ce/dist/index.js"></script>
```

---

## Integration with Livewire

### Basic Livewire Component

**app/Http/Livewire/SpreadsheetComponent.php:**

```php
<?php

namespace App\Http\Livewire;

use Livewire\Component;

class SpreadsheetComponent extends Component
{
    public $data = [];
    public $columns = [];

    public function mount()
    {
        // Initialize data
        $this->data = [
            ['John', 'Doe', 'john@example.com'],
            ['Jane', 'Smith', 'jane@example.com'],
        ];

        // Initialize columns
        $this->columns = [
            ['type' => 'text', 'title' => 'First Name', 'width' => 120],
            ['type' => 'text', 'title' => 'Last Name', 'width' => 120],
            ['type' => 'text', 'title' => 'Email', 'width' => 200],
        ];
    }

    public function updateData($newData)
    {
        $this->data = $newData;
        // Save to database or process
    }

    public function render()
    {
        return view('livewire.spreadsheet-component');
    }
}
```

**resources/views/livewire/spreadsheet-component.blade.php:**

```blade
<div>
    <div
        x-data="spreadsheet({
            data: @js($data),
            columns: @js($columns),
            autoWrapRows: true
        })"
        x-init="init()"
        @update-spreadsheet.window="setData($event.detail)"
    ></div>

    <button
        type="button"
        @click="$wire.updateData(getData())"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
        Save Data
    </button>
</div>
```

### Advanced: Two-way Data Binding

**Alpine component with Livewire sync:**

```javascript
export default (config = {}) => ({
    spreadsheet: null,

    init() {
        this.spreadsheet = jspreadsheet(this.$el, {
            worksheets: [
                {
                    ...config,
                    onchange: (instance, cell, x, y, value) => {
                        // Sync changes to Livewire
                        this.$wire.set('data', this.getData());
                    },
                },
            ],
        });
    },

    getData() {
        return this.spreadsheet[0].getData();
    },
});
```

---

## Configuration Examples

### Basic Table

```javascript
jspreadsheet(element, {
    worksheets: [
        {
            data: [
                ['A1', 'B1', 'C1'],
                ['A2', 'B2', 'C2'],
            ],
            columns: [
                { type: 'text', title: 'Column A', width: 120 },
                { type: 'text', title: 'Column B', width: 120 },
                { type: 'text', title: 'Column C', width: 120 },
            ],
        },
    ],
});
```

### Auto-Wrap Rows (New Feature)

```javascript
jspreadsheet(element, {
    worksheets: [
        {
            autoWrapRows: true, // Enables auto row height adjustment
            data: [['Short', 'This is a very long text that will wrap automatically', 'Normal']],
            columns: [
                { type: 'text', title: 'A', width: 100 },
                { type: 'text', title: 'B', width: 300 },
                { type: 'text', title: 'C', width: 100 },
            ],
        },
    ],
});
```

### Column Types

```javascript
columns: [
    { type: 'text', title: 'Name', width: 120 },
    { type: 'dropdown', title: 'Status', width: 100, source: ['Active', 'Inactive'] },
    { type: 'calendar', title: 'Date', width: 120 },
    { type: 'numeric', title: 'Price', width: 100, mask: '#,##0.00' },
    { type: 'checkbox', title: 'Enabled', width: 80 },
    { type: 'color', title: 'Color', width: 100 },
    { type: 'image', title: 'Photo', width: 120 },
];
```

### Events

```javascript
jspreadsheet(element, {
    worksheets: [
        {
            data: data,
            columns: columns,

            // Cell change event
            onchange: (instance, cell, x, y, value) => {
                console.log('Cell changed:', { x, y, value });
            },

            // Before change event (can prevent change)
            onbeforechange: (instance, cell, x, y, value) => {
                if (value === 'blocked') {
                    return false; // Prevent change
                }
            },

            // Selection event
            onselection: (instance, x1, y1, x2, y2) => {
                console.log('Selection:', { x1, y1, x2, y2 });
            },

            // Load event
            onload: (instance) => {
                console.log('Spreadsheet loaded');
            },
        },
    ],
});
```

---

## API Methods

### Data Methods

```javascript
const worksheet = spreadsheet[0]; // Get first worksheet

// Get all data
const data = worksheet.getData();

// Set data
worksheet.setData([
    ['A1', 'B1'],
    ['A2', 'B2'],
]);

// Get cell value
const value = worksheet.getValue('A1');

// Set cell value
worksheet.setValue('A1', 'New Value');

// Get row data
const row = worksheet.getRowData(0);

// Set row data
worksheet.setRowData(0, ['A1', 'B1', 'C1']);
```

### Row/Column Methods

```javascript
// Insert row
worksheet.insertRow(1, 1); // Insert 1 row at index 1

// Delete row
worksheet.deleteRow(1, 1); // Delete 1 row at index 1

// Insert column
worksheet.insertColumn(1, 1); // Insert 1 column at index 1

// Delete column
worksheet.deleteColumn(1, 1); // Delete 1 column at index 1

// Move row
worksheet.moveRow(0, 2); // Move row 0 to position 2

// Hide/show row
worksheet.hideRow(1);
worksheet.showRow(1);
```

### Meta Information

```javascript
// Set meta info for cell
worksheet.setMeta('A1', 'customProperty', 'value');

// Get meta info
const meta = worksheet.getMeta('A1');

// Set multiple meta
worksheet.setMeta({
    A1: { prop1: 'value1' },
    B2: { prop2: 'value2' },
});
```

---

## Styling

### Custom CSS

```css
/* Custom table styling */
.jss_spreadsheet {
    font-family: 'Inter', sans-serif;
}

/* Custom cell styling */
.jss_worksheet > tbody > tr > td {
    padding: 8px;
}

/* Highlight specific cells */
.custom-highlight {
    background-color: #fff3cd !important;
    font-weight: bold;
}
```

Apply styles programmatically:

```javascript
worksheet.setStyle('A1', 'background-color', '#ffeb3b');
worksheet.setStyle('A1:C3', 'font-weight', 'bold');
```

---

## Troubleshooting

### Common Issues

**1. Styles not loading:**

```javascript
// Make sure CSS is imported
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';
```

**2. Alpine.js not recognizing component:**

```javascript
// Ensure Alpine.start() is called AFTER registering components
Alpine.data('spreadsheet', spreadsheet);
Alpine.start();
```

**3. Livewire conflicts:**

```blade
<!-- Use wire:ignore to prevent Livewire from tracking the element -->
<div wire:ignore>
    <div x-data="spreadsheet(...)"></div>
</div>
```

**4. Multiple instances:**

```javascript
// Destroy old instance before creating new one
if (this.spreadsheet) {
    jspreadsheet.destroy(this.$el);
}
this.spreadsheet = jspreadsheet(this.$el, config);
```

---

## Resources

-   [Official Documentation](https://bossanova.uk/jspreadsheet/)
-   [GitHub Repository](https://github.com/jspreadsheet/ce)
-   [Examples](https://bossanova.uk/jspreadsheet/docs/examples)
-   [API Reference](https://bossanova.uk/jspreadsheet/docs)

---

## New Features in This Build

### autoWrapRows

Automatically adjusts row height based on content while typing:

```javascript
{
    autoWrapRows: true; // Enable auto-wrap feature
}
```

**Features:**

-   Disables manual row resizing
-   Text automatically wraps to multiple lines
-   Row height adjusts in real-time while typing
-   Textarea editor matches cell styling (font, padding, line-height)
-   Selection corner hidden during editing for cleaner UX

### Diagonal Copy/Fill

Enhanced copy functionality with intelligent axis detection:

-   **Horizontal drag**: Copies along row
-   **Vertical drag**: Copies along column
-   **Diagonal drag**: Copies in both dimensions

Simply drag the selection corner in any direction!

---

## License

MIT License - see LICENSE file for details
