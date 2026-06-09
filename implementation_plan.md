# Implementation Plan for Adding Student Contribution to Event Creation

## Goal Description
When creating a new event, provide an option to specify an amount contributed by a student. This amount should be added to the student's `AmountPaid` and affect the `Total Owed` in the Student Records Registry.

## User Review Required
- Confirm the UI layout for the new input field in the "New Event" modal (e.g., place it below the event title input).
- Choose whether the contribution amount should be entered per student individually at event creation, or a default amount applied to all selected students.

> [!IMPORTANT]
> This change will modify the event creation flow and student payment calculations. Ensure admin permissions are respected.

## Open Questions
- Should the contribution amount be optional? (Recommended: optional, default 0)
- Should the system automatically update `AmountOwed` = `Total Owed` - `AmountPaid` after each contribution?
- Do we need to display the updated owed amount immediately in the Student Records table?

## Proposed Changes
---
### UI Components
- **[MODIFY] [index.html](file:///c:/Users/Rasika/Desktop/batch-fund/index.html)**
  - Add an `<input type="number" id="eventStudentContribution" placeholder="Contribution Amount (Rs.)" min="0" class="form-control" />` inside the `eventForm` modal.

- **[MODIFY] [index.css](file:///c:/Users/Rasika/Desktop/batch-fund/index.css)**
  - Add styling for the new input to match existing form controls.

---
### JavaScript Logic
- **[MODIFY] [app.js](file:///c:/Users/Rasika/Desktop/batch-fund/app.js)**
  - Extend `handleNewEvent()` to read the contribution amount from `#eventStudentContribution`.
  - When a student is selected for the event (existing selection flow), update their `AmountPaid` field in the `students` state and recalculate `AmountOwed`.
  - Persist changes via Supabase `update('students', ...)` if enabled.
  - Update the UI table row for the student to reflect new totals.

---
### Data Model
- No schema changes needed; fields `AmountPaid` and `AmountOwed` already exist.

## Verification Plan
### Automated Tests
- Run unit test to simulate creating an event with a contribution amount and verify the student's `AmountPaid` increased and `AmountOwed` decreased accordingly.

### Manual Verification
- Open the app, create a new event, enter a contribution amount, select a student, submit.
- Check the Student Records Registry table shows updated Paid Amount and Total Owed.

