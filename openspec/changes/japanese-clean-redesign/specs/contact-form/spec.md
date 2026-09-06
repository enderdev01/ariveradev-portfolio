# Contact Form Specification

## Purpose

Define submission feedback, live-region announcement, and persistence of
error/success state on the Contact form.

## Requirements

### Requirement: Success feedback is announced and persists

On successful submission, `Contact.js` MUST render a success banner with
`role="status"`. The banner MUST NOT be removed by a `setTimeout` state
reset; it persists until the user takes another action (e.g., dismisses it
or resubmits).

#### Scenario: Success banner has role=status

- GIVEN a successful form submission
- WHEN the success banner renders
- THEN it has `role="status"` in the DOM

#### Scenario: Success banner persists (negative case for auto-dismiss)

- GIVEN a successful submission renders the banner
- WHEN more than the previous auto-dismiss delay elapses with no user action
- THEN the banner is still present in the DOM
- AND no `setTimeout` in `Contact.js` clears the success state

### Requirement: Error feedback is announced and retry persists

On a failed submission, `Contact.js` MUST render an error banner with
`role="alert"`. The error message and retry affordance MUST persist — no
`setTimeout` may reset the error state.

#### Scenario: Error banner has role=alert

- GIVEN a failed form submission
- WHEN the error banner renders
- THEN it has `role="alert"` in the DOM

#### Scenario: Error state and retry persist (negative case for auto-dismiss)

- GIVEN a failed submission renders the error banner and a retry action
- WHEN time elapses with no user action
- THEN the error message and retry control remain visible
- AND no `setTimeout` in `Contact.js` clears the error state

### Requirement: Exactly one seal beside the Contact CTA

The hanko seal MUST render exactly once, positioned beside the Contact
submit CTA.

#### Scenario: Single seal near CTA

- GIVEN the rendered Contact section
- WHEN seal elements are counted
- THEN exactly one seal renders, adjacent to the submit CTA
