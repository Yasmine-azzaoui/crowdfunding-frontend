# Dorfkind - README Requirements Mapping

## Project Overview

**Dorfkind** is a community-driven crowdfunding platform specifically designed to help families connect for childcare support. The platform allows users to create fundraisers requesting either monetary or time-based help (volunteer hours).

---

## Requirements Checklist vs Implementation

### ✅ Core Architecture

- [x] **Separated into two projects**: Django REST API backend + React frontend
- [x] **Cool project name**: "Dorfkind" (German for "village child") - no pun/missing vowels, but thematically appropriate for community-driven childcare support
- [x] **Clear target audience**: Families seeking childcare support in their local community

### ✅ User Accounts

- [x] **Username**: Stored in user profile
- [x] **Email address**: Stored in user profile
- [x] **Password**: Hashed and managed by Django authentication
- [x] **Token Authentication**: Implemented with Token-based auth endpoint

### ✅ Fundraiser Features

- [x] **Title**: Required field in fundraiser creation
- [x] **Owner**: Automatically set to logged-in user
- [x] **Description**: Required field with detailed text support
- [x] **Image**: File upload support for fundraiser images
- [x] **Target amount**: Required for money/both pledges (goal field)
- [x] **Open/Closed status**: Toggle button on fundraiser detail page and account page
- [x] **Creation timestamp**: Displayed on fundraisers (date_created field)

### ✅ Child Profile Features (Extension beyond base requirements)

- [x] **First name & Last name**: User input on fundraiser creation
- [x] **Date of Birth**: User input on fundraiser creation
- [x] **Description**: Text field describing the child
- [x] **Special needs indicator**: Checkbox with optional specification
- [x] **Image**: File upload for child photo
- [x] **Linked to fundraiser**: Child is attached to specific fundraiser via foreign key

### ✅ Pledge Features

- [x] **Amount**: Required for money pledges (numeric value with currency)
- [x] **Fundraiser link**: Pledge is tied to specific fundraiser
- [x] **Supporter/User**: Pledge linked to user who created it
- [x] **Anonymous option**: Supported in pledge model
- [x] **Pledge type**: Money, time, or both types supported
- [x] **Hours**: For time pledges, users can pledge hours

### ⚠️ Pledge Features (Partial/Not Implemented)

- [ ] **Comment field**: Listed in requirements but not yet implemented in pledge system

### ✅ Update/Delete Functionality

- [x] **Fundraiser update**: Implemented via toggle to close/reopen fundraisers
- [x] **Permissions**: Only fundraiser owner can close/reopen
- [x] **Status persistence**: Changes saved to backend

### ✅ Permissions & Authorization

- [x] **Owner-only controls**: Close/reopen button only shows for fundraiser owner
- [x] **Bluecard verification**: Only verified users can create fundraisers and pledge time
- [x] **Token-based access**: Protected endpoints require valid auth token

### ✅ API Status Codes

- [x] **200 OK**: Successful GET requests
- [x] **201 Created**: Successful fundraiser/child/pledge creation
- [x] **400 Bad Request**: Validation errors (e.g., missing goal field)
- [x] **401 Unauthorized**: Missing/invalid authentication token
- [x] **403 Forbidden**: Insufficient permissions
- [x] **404 Not Found**: Resource not found (custom page implemented)

### ✅ Error Handling

- [x] **Custom 404 page**: Implemented with navigation options
- [x] **Graceful error messages**: Form validation errors displayed to user
- [x] **Console logging**: Detailed debug logs for troubleshooting

### ✅ Design & UX

- [x] **Responsive design**: Mobile, tablet, and desktop layouts
- [x] **Accessible colors**: Earthy palette with high contrast ratios (WCAG AA/AAA)
- [x] **Modern styling**: Gradient effects, smooth transitions, hover states
- [x] **Navigation**: Clear user flows between pages

---

## Feature Implementation Details

### Authentication Flow

1. User registers (optional - can login without existing account)
2. User logs in with username/password
3. Backend returns authentication token + user details
4. Token stored in localStorage for subsequent requests
5. Token required for: viewing account, creating fundraisers, pledging

### Fundraiser Creation Flow

1. User must be authenticated AND have bluecard verification
2. User fills in fundraiser details (title, summary, description, goal, pledge type)
3. User uploads fundraiser image (optional)
4. User creates child profile inline:
   - Enters child's basic info (first/last name, DOB, description)
   - Selects if child has special needs
   - Uploads child's photo
5. On submit: Fundraiser created first → Child created and linked to fundraiser
6. User redirected to account page

### Pledge Flow

1. User visits fundraiser detail page
2. **Money pledge**: User selects preset amount ($25/$50/$100) or enters custom amount
3. **Time pledge**:
   - Only available to bluecard-verified users
   - Default 2 hours pledged
   - Optional scheduled date/time
4. Pledge submitted to backend
5. Pledge appears in "Recent Support" section with supporter's first name

### Progress Tracking

- **Money progress**: Shows amount raised vs. goal with progress bar
- **Time progress**: Shows total hours pledged and count of time pledges
- **Supporter count**: Shows total number of people who pledged

---

## Pages Implemented

| Page              | Route                | Description                                 |
| ----------------- | -------------------- | ------------------------------------------- |
| Home              | `/`                  | Welcome message + open fundraisers list     |
| Login             | `/login`             | Username/password authentication            |
| Account           | `/account`           | Created fundraisers + supported fundraisers |
| Create Fundraiser | `/create-fundraiser` | Form to create fundraiser + child           |
| Fundraiser Detail | `/fundraiser/:id`    | Full fundraiser info + pledge interface     |
| All Fundraisers   | `/fundraisers`       | Paginated list of all fundraisers           |
| 404 Not Found     | `*`                  | Custom error page with navigation           |

---

## API Endpoints Used

### Authentication

- `POST /api-token-auth/` - Login and get token
- `GET /users/` - Get all users (for mapping supporter names)
- `GET /users/current/` - Get current logged-in user

### Fundraisers

- `GET /fundraisers/` - List all fundraisers
- `GET /fundraisers/{id}/` - Get single fundraiser
- `POST /fundraisers/` - Create fundraiser
- `PATCH /fundraisers/{id}/` - Update fundraiser (toggle is_open)

### Children

- `GET /children/` - Get all children (filtered client-side by fundraiser)
- `POST /children/` - Create child profile

### Pledges

- `GET /pledges/` - Get all pledges
- `POST /pledges/` - Create pledge

---

## Color Palette (Earthy & Organic)

| Variable         | Color   | Usage                        |
| ---------------- | ------- | ---------------------------- |
| `--brand`        | #5d7b4f | Sage green                   |
| `--primary`      | #6b8e23 | Olive green (buttons, links) |
| `--primary-dark` | #3d5a1a | Dark forest green            |
| `--secondary`    | #c67c4e | Terracotta (accents)         |
| `--action`       | #8b6f47 | Warm taupe                   |
| `--text-dark`    | #2b2419 | Deep brown                   |
| `--bg-light`     | #faf8f5 | Off-white background         |

---

## Files & Structure

```
src/
├── Pages/
│   ├── HomePage.jsx           - Welcome + fundraisers list
│   ├── LoginPage.jsx          - Login form
│   ├── AccountPage.jsx        - User dashboard
│   ├── CreateFundraiser.jsx   - Fundraiser + child creation
│   ├── FundraiserPage.jsx     - Detail page + pledging
│   ├── FundraisersPage.jsx    - All fundraisers view
│   └── NotFoundPage.jsx       - 404 error page (NEW)
├── components/
│   ├── Layout.jsx             - Main layout wrapper
│   ├── NavBar.jsx             - Navigation menu
│   ├── LoginForm.jsx          - Login form component
│   ├── FundraiserCard.jsx     - Fundraiser preview card
│   ├── ChildCard.jsx          - Child profile card
│   └── SignupForm.jsx         - Signup form (optional)
├── api/
│   ├── get-fundraisers.js     - Fetch all fundraisers
│   ├── get-fundraiser.js      - Fetch single fundraiser
│   ├── get-children-by-fundraiser.js - Fetch children for fundraiser
│   ├── get-pledges.js         - Fetch all pledges
│   ├── get-users.js           - Fetch all users (NEW)
│   ├── post-fundraiser.js     - Create fundraiser
│   ├── post-child.js          - Create child
│   ├── post-pledge.js         - Create pledge
│   ├── post-login.js          - Authenticate user
│   ├── get-current-user.js    - Get logged-in user
│   └── patch-fundraiser.js    - Update fundraiser
├── hooks/
│   ├── use-fundraisers.js     - Fetch fundraisers hook
│   └── use-fundraiser.js      - Fetch single fundraiser hook
├── modern.css                 - Complete styling (1500+ lines)
├── index.css                  - Root styles
├── main.jsx                   - Router setup
└── App.jsx                    - Main app component
```

---

## Key Features Summary

✨ **What Makes Dorfkind Special:**

1. **Child-Centric Design**: Each fundraiser is tied to a specific child, creating emotional connection
2. **Dual Pledge Types**: Money OR volunteer hours - flexibility for different types of support
3. **Community Focus**: Named after "village child" concept - emphasizes community care
4. **Bluecard Verification**: Security measure ensuring trusted volunteers can pledge time
5. **Progress Visibility**: Users can see at a glance how much support fundraiser has received
6. **Modern UX**: Earthy colors, responsive design, intuitive navigation

---

## Missing Feature for Future Implementation

- **Pledge Comments**: Users can add comments/messages with their pledge (requirement listed but not implemented)
- **Edit Fundraiser Details**: Currently only toggle open/closed - could allow updating description/image
- **Delete Fundraiser**: Owner can delete their fundraiser
- **Pledge Withdrawal**: Users can remove/modify their pledges
- **Fundraiser Search/Filter**: Advanced filtering by category, location, etc.

---

## Testing the 404 Page

Visit any non-existent route to see the custom 404 page:

- `http://localhost:5173/invalid-page`
- `http://localhost:5173/random-path`

Features:

- Animated village emoji illustration
- "Return to Home" button
- "Go Back" button (browser history)
- Quick links to common pages
- Mobile responsive design
