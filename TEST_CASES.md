# MRIIC Inventory Test Cases

These manual test cases map to the automated Playwright coverage in `tests/`.

| ID | Area | Scenario | Steps | Expected Result | Automated |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Public | Home page loads | Open `/` | MRIIC home content and navigation are visible | Yes |
| TC-002 | Public | Browse inventory catalogue | Open `/products/` | Lab Inventory page shows seeded resource cards | Yes |
| TC-003 | Public | Filter inventory by category | Select a category and apply filter | Matching resources remain, non-matching resources are hidden | Yes |
| TC-004 | Public | Search inventory | Search from the navbar | Search results page shows matching resources | Yes |
| TC-005 | Public | Open resource detail | Click View details on a resource card | Detail page shows item name, quantity, categories, description, and borrow form | Yes |
| TC-006 | Public | Submit valid borrow request | Fill name, email, quantity, purpose, submit | Success alert appears and request is created for staff review | Yes |
| TC-007 | Public | Reject excessive borrow quantity | Request more than available stock | Error alert shows current available stock | Yes |
| TC-008 | Public | Empty and unmatched search states | Open search with blank query and with a query that matches nothing | Empty guidance and No items found state appear with no resource cards | Yes |
| TC-009 | Public | Browser-side borrow validation | Submit borrow form with an invalid email | Browser validation blocks submission and no server alert appears | Yes |
| TC-010 | Auth | Protect staff workspace | Open `/inventory/` while logged out | User is redirected to `/admin-login/` | Yes |
| TC-011 | Auth | Invalid staff login | Submit bad credentials on `/admin-login/` | Invalid username/password alert appears | Yes |
| TC-012 | Auth | Valid staff login | Submit seeded staff credentials | Staff navigation displays Manage and Add controls | Yes |
| TC-013 | Auth | Staff logout | Click Logout while signed in | User returns to public state and sees logout message | Yes |
| TC-014 | Staff | Add category | Open Add Resource page, enter category, save | Category success alert appears | Yes |
| TC-015 | Staff | Reject blank category | Submit category add form without a name | Validation alert asks for a category name | Yes |
| TC-016 | Staff | Detect duplicate category | Submit an existing category name | Already-exists alert appears | Yes |
| TC-017 | Staff | Reject blank resource | Submit Add Resource with required fields missing | Error alert and field-level validation messages appear | Yes |
| TC-018 | Staff | Add inventory resource with image | Fill resource form with name, category, fixture image, quantity, featured flag, description, tags | User returns to workspace, new resource appears, and detail page renders the uploaded image | Yes |
| TC-019 | Staff | Edit resource | Open edit form for existing resource, change quantity/description, save | Workspace shows updated quantity and success alert | Yes |
| TC-020 | Staff | Update dashboard resource controls | Change quantity and featured checkbox in workspace, save | Resource row persists updated values | Yes |
| TC-021 | Staff | Block negative dashboard quantity | Enter a negative quantity from the staff workspace and save | Browser validation blocks submission and the previous quantity remains saved | Yes |
| TC-022 | Staff | Search staff inventory | Search workspace by resource name | Only matching inventory rows appear | Yes |
| TC-023 | Staff | Cancel delete dialog | Click delete and dismiss browser confirmation | Resource remains visible and is not removed | Yes |
| TC-024 | Staff | Delete resource | Click delete and confirm browser dialog | Resource is removed and success alert appears | Yes |
| TC-025 | Staff | Approve borrow request | Submit request publicly, login as staff, approve | Request becomes approved and item stock decreases | Yes |
| TC-026 | Staff | Block approval when stock changed | Submit request, reduce stock below requested quantity, approve | Error alert appears, request stays pending, and stock is unchanged | Yes |
| TC-027 | Staff | Mark item returned | After approval, click Mark returned | Request disappears from active list and item stock is restored | Yes |
| TC-028 | Staff | Reject borrow request | Submit request publicly, login as staff, reject | Request is removed from active notifications and stock is unchanged | Yes |
| TC-029 | Responsive | Mobile catalogue smoke test | Run the suite under the mobile Chrome Playwright project | Main public and staff workflows remain usable on mobile viewport | Yes |
