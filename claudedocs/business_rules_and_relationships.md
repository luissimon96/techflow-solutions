# Business Rules and Data Relationships

## Entity Relationship Overview

```
Admin (1) ──── manages ──── (*) Project
Admin (1) ──── reviews ──── (*) Quote  
Admin (1) ──── responds ──── (*) User (Contact)

Project (1) ──── contains ──── (*) Technology
Project (1) ──── contains ──── (*) Feature  
Project (1) ──── contains ──── (*) Image
Project (1) ──── contains ──── (*) Video
Project (1) ──── contains ──── (*) Metric

Quote (1) ──── from ──── (1) Client
Quote (1) ──── for ──── (1) Project Proposal
```

## Detailed Business Rules

### 1. Project Management Rules

#### Project Lifecycle:
```
DRAFT → REVIEW → PUBLISHED → ARCHIVED
```

**Status Transitions**:
- `draft`: New project, editable
- `review`: Submitted for review, limited editing
- `published`: Live on website, public access
- `archived`: Removed from public view, historical record

#### Visibility Rules:
- `public`: Visible to all users
- `private`: Only visible to admins
- `client_only`: Visible to specific client and admins

#### Featured Projects:
- Maximum 6 featured projects allowed
- Featured projects have order (1-6)
- Order must be unique among featured projects
- Auto-reordering when conflicts occur

#### SEO & URL Rules:
- Slug auto-generated from title if not provided
- Slug must be unique across all projects
- Format: lowercase, alphanumeric + hyphens only
- Meta title max 60 chars, auto-truncated with "..."
- Meta description max 160 chars, auto-generated from shortDescription or description

#### Analytics Rules:
- Views incremented on each project page visit
- Last viewed timestamp updated on each view
- Likes and shares manually tracked
- No duplicate counting (implementation dependent)

### 2. Authentication & Authorization Rules

#### Password Security:
- Minimum 8 characters required
- Bcrypt hashing with 12 salt rounds
- Password change updates `passwordChangedAt` timestamp

#### Account Locking:
- Maximum 5 failed login attempts
- Account locked for 2 hours after 5 failures
- Lock counter resets after successful login
- Lock timer resets attempts if expired

#### Token Management:
- Access tokens: 15 minutes lifespan
- Refresh tokens: 7 days lifespan  
- Multiple refresh tokens per user allowed
- Tokens contain: id, email, role
- Refresh tokens contain: id, type='refresh'

#### Role-Based Access:
- `admin`: Standard administrative access
- `super-admin`: Full system access
- Role determines available actions (implementation dependent)

### 3. Quote/Proposal Management Rules

#### Quote Status Workflow:
```
PENDING → IN_ANALYSIS → PROPOSAL_SENT → ACCEPTED/REJECTED/CANCELED
```

**Status Transitions**:
- `pending`: New quote, awaiting review
- `in_analysis`: Under evaluation by team
- `proposal_sent`: Formal proposal delivered (sets proposalSentAt)
- `accepted`: Client accepted proposal (sets proposalAcceptedAt)
- `rejected`: Client declined proposal
- `canceled`: Quote cancelled (client or internal)

#### Response Time Tracking:
- Calculated as days between `createdAt` and `proposalSentAt`
- Only calculated when proposal is sent
- Used for performance metrics

#### Budget & Timeline Constraints:
- Budget must be from predefined ranges
- Timeline must be from predefined options
- Helps with automated matching and reporting

#### Client Communication:
- Email required and validated
- Phone optional but validated if provided
- Consent must be explicitly true
- Source tracking for lead attribution

### 4. Contact Form Rules

#### Data Requirements:
- Name, email, subject, message are mandatory
- Company and phone are optional
- Consent must be explicitly accepted
- All text fields have maximum lengths

#### Communication Tracking:
- Each contact creates a User record
- Timestamp tracking for response metrics
- Email format validation
- Phone format validation (international format)

### 5. Technology & Feature Management

#### Technology Categorization:
- Each technology has a category (frontend, backend, database, cloud, mobile, other)
- Categories used for filtering and display
- Names should be consistent (case-sensitive)

#### Feature Classification:
- Features categorized as: core, advanced, integration, security, performance, other
- Core features highlight main functionality
- Advanced features show complexity
- Categories affect display priority

### 6. Media Management Rules

#### Image Handling:
- Each project can have multiple images
- One image can be marked as primary (isPrimary: true)
- Image types: screenshot, mockup, architecture, logo, other
- Alt text required for accessibility
- URL validation required

#### Video Handling:
- Multiple videos per project allowed
- Video types: demo, presentation, tutorial, testimonial
- Title required for each video
- URL validation required

### 7. Data Validation Rules

#### URL Validation:
- Live links: Must start with http:// or https://
- GitHub links: Must be valid GitHub URLs
- Documentation links: Must be valid URLs
- Case study links: Must be valid URLs

#### Text Field Limits:
```
Project:
- title: 5-200 characters
- description: 20-2000 characters  
- shortDescription: max 300 characters

Admin:
- name: max 100 characters
- email: valid email format

Quote:
- clientName: 2-100 characters
- projectDescription: 20-2000 characters
- notes: max 1000 characters

User (Contact):
- name: max 100 characters
- subject: max 200 characters
- message: max 2000 characters
```

#### Enum Validations:
- All enum fields must match predefined values exactly
- Case sensitive matching
- No custom values allowed outside enum lists

### 8. Audit Trail Rules

#### Timestamp Tracking:
- `createdAt`: Set automatically on record creation
- `updatedAt`: Updated automatically on any field change
- Cannot be manually modified

#### User Activity Tracking:
- `lastModifiedBy`: Tracks who made the last change
- `lastLogin`: Updated on successful authentication
- `lastViewed`: Updated when content is accessed

### 9. Search & Indexing Rules

#### Full-Text Search:
- Projects searchable by: title, description, client name, tags
- Quotes searchable by: description, goals, client name, company
- Search weights prioritize certain fields

#### Performance Indexes:
- Status + featured combination for homepage
- Category + status for filtering
- Email uniqueness enforcement
- Created date for chronological sorting

### 10. Data Integrity Rules

#### Referential Integrity:
- Projects reference admin who created/modified them
- Quotes track proposal responses and timelines
- Soft delete preferred over hard delete for audit trails

#### Uniqueness Constraints:
- Admin email must be unique
- Project slug must be unique
- Featured project order must be unique

#### Required Relationships:
- Every project must have at least one technology
- Every quote must have client contact information
- Every admin must have a valid email and role

## Migration-Specific Considerations

### Data Consistency Rules:
1. All ObjectIds will be converted to UUIDs
2. Nested objects will become related tables
3. Arrays will become separate tables with foreign keys
4. Enum values must be preserved exactly
5. Indexes must maintain performance characteristics
6. Validation rules must be enforced at database level

### Backward Compatibility:
1. API endpoints should remain unchanged
2. Data format should remain consistent
3. Business logic should be preserved
4. Performance should not degrade