---
description: Development workflow for the AI Support Ticket Triage Hub
---

# // turbo-all

## 1. Foundation: Types and Services
- [ ] Create `src/types/ticket.ts` to define `Ticket`, `TicketCategory`, and triage metadata.
- [ ] Create `src/services/admin/ticket.service.ts` to handle API calls for ticket management.

## 2. Ingestion & User Experience
- [ ] Create `src/routes/_admin/tickets/index.tsx` as the main ticket listing page.
- [ ] Implement role-based filtering:
    - Users see only their own tickets.
    - Admins see all tickets.
- [ ] Create a "New Ticket" modal in `src/components/admin/tickets/ticket-form.tsx` for users to submit complaints.

## 3. Agent Dashboard (Admin Features)
- [ ] Update ticket list view with urgency color-coding (Red for High, Green for Low/Medium).
- [ ] Show AI-derived categories and urgency scores in the table.
- [ ] Implement `src/routes/_admin/tickets/$ticketId.tsx` for the detail view.

## 4. Triage & Recovery Flow
- [ ] In Detail View, display the AI-generated draft response.
- [ ] Allow agents to edit the draft.
- [ ] Implement the "Resolve" button which updates the ticket status and finalizes the response.

## 5. Navigation & UI Integration
- [ ] Add "Tickets" to the sidebar in `src/components/admin/layout/sidebar.tsx`.
- [ ] Ensure consistent branding and premium aesthetics using Shadcn and Lucide icons.
- [ ] Verify responsive behavior for both user and agent views.
