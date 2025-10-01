# Jspreadsheet CE - Laravel Integration Guide

Quick integration guide for using Jspreadsheet CE in Laravel with Alpine.js and Livewire.

**GitHub Repository (Fork):** [https://github.com/sim0n92/jspreadsheet](https://github.com/sim0n92/jspreadsheet)
**Original Repository:** [https://github.com/jspreadsheet/ce](https://github.com/jspreadsheet/ce)

---

## Installation

### 1. Install via NPM

```bash
npm install jspreadsheet-ce jsuites
```

Or install from local `.tgz` file:

```bash
npm install /path/to/jspreadsheet-ce-5.0.4.tgz
```

### 2. Import in JavaScript

**resources/js/app.js:**
```javascript
import jspreadsheet from 'jspreadsheet-ce';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';

// Make globally available
window.jspreadsheet = jspreadsheet;
```

### 3. Build Assets

```bash
npm run dev
# or for production
npm run build
```

---

## Basic Usage (Without Alpine/Livewire)

**resources/views/spreadsheet.blade.php:**
```blade
<!DOCTYPE html>
<html>
<head>
    <title>Spreadsheet</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="spreadsheet"></div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            jspreadsheet(document.getElementById('spreadsheet'), {
                worksheets: [{
                    data: [
                        ['John', 'Doe', 'john@example.com'],
                        ['Jane', 'Smith', 'jane@example.com']
                    ],
                    columns: [
                        { type: 'text', title: 'First Name', width: 120 },
                        { type: 'text', title: 'Last Name', width: 120 },
                        { type: 'text', title: 'Email', width: 200 }
                    ]
                }]
            });
        });
    </script>
</body>
</html>
```

---

## Alpine.js Integration

### 1. Create Alpine Component

**resources/js/components/spreadsheet.js:**
```javascript
export default (config = {}) => ({
    spreadsheet: null,

    init() {
        this.spreadsheet = jspreadsheet(this.$el, {
            worksheets: [{
                data: config.data || [],
                columns: config.columns || [],
                autoWrapRows: config.autoWrapRows || false,
                ...config
            }]
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
    }
});
```

### 2. Register Component

**resources/js/app.js:**
```javascript
import Alpine from 'alpinejs';
import spreadsheet from './components/spreadsheet';

Alpine.data('spreadsheet', spreadsheet);
Alpine.start();

window.Alpine = Alpine;
```

### 3. Use in Blade

**resources/views/spreadsheet-alpine.blade.php:**
```blade
<!DOCTYPE html>
<html>
<head>
    <title>Spreadsheet with Alpine</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div class="container mx-auto p-4">
        <div
            x-data="spreadsheet({
                data: [
                    ['John', 'Doe', 'john@example.com'],
                    ['Jane', 'Smith', 'jane@example.com']
                ],
                columns: [
                    { type: 'text', title: 'First Name', width: 120 },
                    { type: 'text', title: 'Last Name', width: 120 },
                    { type: 'text', title: 'Email', width: 200 }
                ],
                autoWrapRows: true
            })"
            x-init="init()"
        ></div>

        <button
            @click="console.log(getData())"
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
            Get Data
        </button>
    </div>
</body>
</html>
```

---

## Livewire Integration

### 1. Create Livewire Component

```bash
php artisan make:livewire SpreadsheetComponent
```

**app/Livewire/SpreadsheetComponent.php:**
```php
<?php

namespace App\Livewire;

use Livewire\Component;

class SpreadsheetComponent extends Component
{
    public $data = [];
    public $columns = [];

    public function mount()
    {
        $this->data = [
            ['John', 'Doe', 'john@example.com'],
            ['Jane', 'Smith', 'jane@example.com'],
        ];

        $this->columns = [
            ['type' => 'text', 'title' => 'First Name', 'width' => 120],
            ['type' => 'text', 'title' => 'Last Name', 'width' => 120],
            ['type' => 'text', 'title' => 'Email', 'width' => 200],
        ];
    }

    public function save($spreadsheetData)
    {
        $this->data = $spreadsheetData;

        // Save to database
        // YourModel::updateOrCreate(...);

        session()->flash('message', 'Data saved successfully!');
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
    @if (session()->has('message'))
        <div class="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {{ session('message') }}
        </div>
    @endif

    <div wire:ignore>
        <div
            x-data="spreadsheet({
                data: @js($data),
                columns: @js($columns),
                autoWrapRows: true
            })"
            x-init="init()"
            id="spreadsheet-container"
        ></div>
    </div>

    <div class="mt-4 flex gap-2">
        <button
            @click="$wire.save(getData())"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
            Save Changes
        </button>

        <button
            @click="console.log(getData())"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
            Log Data
        </button>
    </div>
</div>
```

### 2. Use in Blade Layout

**resources/views/spreadsheet-livewire.blade.php:**
```blade
<!DOCTYPE html>
<html>
<head>
    <title>Spreadsheet with Livewire</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Spreadsheet Example</h1>

        @livewire('spreadsheet-component')
    </div>

    @livewireScripts
</body>
</html>
```

### 3. Add Route

**routes/web.php:**
```php
use App\Livewire\SpreadsheetComponent;

Route::get('/spreadsheet', SpreadsheetComponent::class);
```

---

## Quick Examples

### Example 1: Simple Data Table

```javascript
jspreadsheet(element, {
    worksheets: [{
        data: @js($users),
        columns: [
            { type: 'text', title: 'Name', width: 150 },
            { type: 'text', title: 'Email', width: 200 },
            { type: 'dropdown', title: 'Status', width: 100,
              source: ['Active', 'Inactive'] }
        ]
    }]
});
```

### Example 2: Auto-Wrap Rows

```javascript
jspreadsheet(element, {
    worksheets: [{
        autoWrapRows: true,  // New feature!
        data: [
            ['Short', 'This is a very long text that will automatically wrap'],
        ],
        columns: [
            { type: 'text', title: 'Column A', width: 100 },
            { type: 'text', title: 'Column B', width: 300 }
        ]
    }]
});
```

### Example 3: With Events

```javascript
jspreadsheet(element, {
    worksheets: [{
        data: data,
        columns: columns,
        onchange: (instance, cell, x, y, value) => {
            console.log('Cell changed:', { x, y, value });
            // Sync to Livewire
            @this.set('data', instance.getData());
        }
    }]
});
```

---

## Common Use Cases

### Loading Data from Controller

**app/Http/Controllers/SpreadsheetController.php:**
```php
<?php

namespace App\Http\Controllers;

use App\Models\User;

class SpreadsheetController extends Controller
{
    public function index()
    {
        $users = User::all()->map(function($user) {
            return [
                $user->name,
                $user->email,
                $user->status
            ];
        })->toArray();

        $columns = [
            ['type' => 'text', 'title' => 'Name', 'width' => 150],
            ['type' => 'text', 'title' => 'Email', 'width' => 200],
            ['type' => 'dropdown', 'title' => 'Status', 'width' => 100,
             'source' => ['Active', 'Inactive']],
        ];

        return view('spreadsheet', compact('users', 'columns'));
    }
}
```

**resources/views/spreadsheet.blade.php:**
```blade
<div
    x-data="spreadsheet({
        data: @js($users),
        columns: @js($columns)
    })"
    x-init="init()"
></div>
```

### Saving Data to Database

```javascript
// In your Alpine component
async saveToDatabase() {
    const data = this.getData();

    await fetch('/api/spreadsheet/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({ data })
    });
}
```

---

## Troubleshooting

### Issue: Styles not loading
**Solution:** Make sure CSS is imported in app.js:
```javascript
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';
```

### Issue: Livewire re-renders break spreadsheet
**Solution:** Always use `wire:ignore`:
```blade
<div wire:ignore>
    <div x-data="spreadsheet(...)"></div>
</div>
```

### Issue: Alpine not finding component
**Solution:** Ensure Alpine.start() is after component registration:
```javascript
Alpine.data('spreadsheet', spreadsheet);
Alpine.start();
```

### Issue: Multiple instances conflict
**Solution:** Destroy old instance first:
```javascript
if (this.spreadsheet) {
    jspreadsheet.destroy(this.$el);
}
```

---

## API Quick Reference

```javascript
const worksheet = spreadsheet[0];

// Data
worksheet.getData()                    // Get all data
worksheet.setData(data)                // Set data
worksheet.getValue('A1')               // Get cell value
worksheet.setValue('A1', 'value')      // Set cell value

// Rows/Columns
worksheet.insertRow(1, 1)              // Insert row
worksheet.deleteRow(1, 1)              // Delete row
worksheet.insertColumn(1, 1)           // Insert column
worksheet.deleteColumn(1, 1)           // Delete column

// Styling
worksheet.setStyle('A1', 'background-color', '#ff0')
worksheet.setStyle('A1:C3', 'font-weight', 'bold')
```

---

## Resources

- [NPM Package Guide](./NPM_PACKAGE_GUIDE.md) - Complete documentation
- [Official Docs](https://bossanova.uk/jspreadsheet/)
- [GitHub](https://github.com/jspreadsheet/ce)

---

## License

MIT License
