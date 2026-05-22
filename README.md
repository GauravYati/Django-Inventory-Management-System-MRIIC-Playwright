# MRIIC Inventory Playwright Automation

This folder is intentionally outside the Django project folder. It contains the Playwright project, automation tests, and manual test cases for the MRIIC Django inventory system.

## Prerequisites

- Node.js 18 or newer
- The Django project dependencies installed in the project virtual environment
- Default Python path: `..\Django-Inventory-Management-System-MRIIC-\p1\Scripts\python.exe`

Override paths when needed:

```powershell
$env:MRIIC_REPO_ROOT="C:\Users\gaura\Documents\GitHub\Django-Inventory-Management-System-MRIIC-"
$env:MRIIC_PYTHON="C:\path\to\python.exe"
$env:BASE_URL="http://127.0.0.1:8000"
```

## Install

PowerShell may block `npm.ps1`, so use `npm.cmd`:

```powershell
npm.cmd install
npx.cmd playwright install
```

If the default `p1` virtual environment is broken or points to another Windows user, create a new Django virtual environment and set `MRIIC_PYTHON` to that Python executable before running tests.

## Run

```powershell
npm.cmd test
```

The Playwright config starts the Django development server automatically with `manage.py runserver`.

## What Is Covered

- Public home, inventory, detail, search, and category filtering
- Borrow request submission
- Staff-only route protection
- Staff login and logout
- Add resource and category
- Edit resource
- Update quantity and featured status
- Delete resource
- Approve, reject, and return borrow requests
- Desktop Chromium and mobile Chrome viewports

## Folder Structure

```text
.
|-- playwright.config.ts       # Playwright runtime configuration
|-- TEST_CASES.md              # Manual test case matrix
|-- support/
|   |-- config/                # Runtime environment configuration
|   |-- django.ts              # Django migration and seed helpers
|   `-- pages/                 # Page object model classes
`-- tests/                     # E2E specs grouped by workflow
```
