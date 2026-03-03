# Project Guidelines for AI Coding Agents

**TechFlow Solutions** is a **React + TypeScript frontend application** (Vite + Chakra UI) with direct WhatsApp integration—no backend database. Keep edits small, focused, and consistent with the patterns below.

## 🎨 Code Style

### TypeScript
- ✅ Explicit types in public functions (avoid `any`, use `unknown` with type guards if needed)
- ✅ Generic types for reusable utilities
- ✅ PascalCase for components: `MyComponent.tsx`
- ✅ camelCase for utilities: `helpers.ts`, `apiEndpoints.ts`

```tsx
// ✅ Good
function submitForm(data: FormData): Promise<SubmitResponse> {
  return fetch(...);
}

// ❌ Avoid
function submitForm(data: any): Promise<any> {
  return fetch(...);
}
```

### React Components
- ✅ Functional components with hooks only
- ✅ Props with TypeScript types (no `PropTypes`)
- ✅ Descriptive names: `ServiceCard`, not `SC`
- ✅ Always include `<Helmet>` for SEO in page components

```tsx
import { Helmet } from 'react-helmet-async';

export default function MyPage() {
  return (
    <>
      <Helmet>
        <title>Page Title</title>
        <meta name="description" content="..." />
      </Helmet>
      {/* page content */}
    </>
  );
}
```

### Feedback & UX
- ✅ Use Chakra UI `useToast()` for notifications
- ✅ Show loading state during async operations
- ✅ Display helpful error messages to users
- ✅ Validate form inputs with Zod schemas (`frontend/src/lib/validation.ts`)

---

## 🏗️ Architecture

### Project Structure
```
frontend/src/
├── pages/                # 6 page components
│  ├── Home.tsx          # Landing: hero, stats, services, CTA
│  ├── ITServices.tsx    # Featured: IT support, security, cloud (PROMINENT in nav)
│  ├── Services.tsx      # Dev services: web, mobile, e-commerce
│  ├── About.tsx         # Corporate: TechFlow Solutions (150+ clients, 10+ years)
│  ├── Contact.tsx       # Contact form → WhatsApp
│  └── QuoteRequest.tsx  # Quote form (pre-filled from Services/ITServices)
│
├── components/          # Reusable components
│  ├── Header.tsx        # Navigation (order: ITServices → Services → About)
│  ├── Footer.tsx        # Footer with contact
│  ├── Layout.tsx        # Layout wrapper
│  ├── common/           # Generic components
│  │  ├── Logo.tsx
│  │  ├── ServiceCard.tsx
│  │  ├── SEOHead.tsx
│  │  ├── ImageFallback.tsx
│  │  └── ServiceModal.tsx
│  └── IT/               # IT-specific
│     └── PackageComparison.tsx
│
├── lib/                 # Configuration & utilities
│  ├── router.tsx        # React Router v6 setup
│  ├── query.tsx         # React Query provider
│  ├── validation.ts     # Zod form schemas
│  ├── whatsapp.ts       # WhatsApp URL generation (wa.me/...)
│  ├── analytics.tsx     # Vercel Analytics
│  └── sentry.ts         # Error tracking
│
├── data/                # Static data (not in DB)
│  ├── services.ts       # Dev services catalog
│  └── itServices.ts     # IT services + pricing
│
├── types/               # TypeScript definitions
│  └── global.d.ts
│
├── utils/               # Helper functions
│  └── iconUtils.ts      # Icon mappings
│
├── main.tsx             # Entry point
├── App.tsx
└── theme.ts             # Chakra UI custom theme
```

### Data Flow
1. **User fills form** → Contact.tsx or QuoteRequest.tsx
2. **Frontend validates** → Zod schema validation
3. **Generate WhatsApp URL** → `whatsapp.ts` helper (wa.me/5554997109051?text=...)
4. **Open WhatsApp** → `window.open(url, '_blank')`
5. **No data stored** → Direct WhatsApp conversation

### Critical Architecture Decisions
- **No Backend Database:** Stateless frontend, all contact data flows to WhatsApp
- **No API Calls:** Frontend generates WhatsApp URLs directly (no server intermediary needed)
- **React Router v6:** Nested routes, simple structure (6 main pages)
- **Chakra UI:** Accessible components, built-in dark mode, TypeScript support
- **React Query:** Server state caching, automatic retries (use for future API if added)
- **Vercel Analytics + Sentry:** Track usage and errors

---

## 🚀 Build & Test Commands

```bash
npm install              # Install dependencies (frontend only)
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run build            # Build for production (frontend/dist/)
npm test                 # Run Jest tests (frontend only)
npm run test:coverage    # Coverage report
npm run lint             # ESLint checks
npm run format           # Prettier formatting
npm run clean            # Remove build artifacts
```

**During Development:**
- Save changes → Vite hot-reload (instant)
- Run `npm run build` locally to verify production build works
- Fix TypeScript errors before committing: `npx tsc --noEmit`

---

## 📋 Project Conventions (Must-Follow)

### Form Submission Pattern (Contact/Quote Flows)
**Do this:**
```tsx
// Contact.tsx
const handleSubmit = (data: ContactFormData) => {
  const whatsappUrl = generateWhatsAppURL('Olá! Meu nome é ' + data.name + '...');
  window.open(whatsappUrl, '_blank');
};
```

**DO NOT:**
- ❌ Call a backend API endpoint
- ❌ Try to store form data in a database
- ❌ Send email from frontend

### Pre-fill Quote Form Pattern
Use React Router `location.state` to pass data from Services → QuoteRequest:
```tsx
// Services.tsx
const handleQuoteRequest = (service: Service) => {
  navigate('/orcamento', {
    state: {
      projectName: service.title,
      projectType: service.category,
      timeline: service.duration,
      budget: 'A definir',
      projectDescription: service.description,
      mainGoals: service.benefits.join(', '),
    },
  });
};

// QuoteRequest.tsx
const location = useLocation();
const state = location.state as PrefilledData | null;
useEffect(() => {
  if (state) {
    setFormData(state); // Auto-fill form
  }
}, [state]);
```

### SEO with Helmet
All pages must have `<Helmet>` tags for metadata:
```tsx
<Helmet>
  <title>Services - TechFlow Solutions</title>
  <meta name="description" content="Web development, mobile apps, e-commerce..." />
  <meta name="keywords" content="web development, services, IT" />
</Helmet>
```

### WhatsApp URL Generation
```tsx
// whatsapp.ts
export function generateWhatsAppURL(message: string): string {
  const phoneNumber = '5554997109051'; // Brazil phone format
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}
```

### CRITICAL: HelmetProvider in main.tsx
**This MUST wrap the entire app or SEO will break:**
```tsx
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <ChakraProvider theme={theme}>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ChakraProvider>
  </HelmetProvider>
);
```

### Dark Mode Support
Use Chakra's `useColorModeValue` for color-aware components:
```tsx
const bgColor = useColorModeValue('white', 'gray.800');
const textColor = useColorModeValue('black', 'white');
```

### Testing Pattern
Write tests for components in `__tests__/` adjacent to the component:
```
components/
├── Logo.tsx
├── __tests__/
│  └── Logo.test.tsx
```

---

## 🔗 Integration Points

### WhatsApp
- **Phone:** `5554997109051` (Brazil format)
- **Flow:** User submits form → Frontend generates `wa.me/...?text=...` URL → Opens WhatsApp
- **Location:** Helpers in `frontend/src/lib/whatsapp.ts`

### Vercel Analytics
- Automatically enabled for performance tracking
- Code: `frontend/src/lib/analytics.tsx`

### Sentry Error Tracking
- Logs unexpected errors to Sentry dashboard
- Configure via `frontend/src/lib/sentry.ts`
- **DO NOT** log sensitive data (emails, phone numbers)

### React Router
- Config: `frontend/src/lib/router.tsx`
- Route mapping:
  - `/` → Home
  - `/servicos-ti` → ITServices
  - `/servicos` → Services
  - `/sobre` → About
  - `/contato` → Contact
  - `/orcamento` → QuoteRequest

### Chakra UI Theme
- Custom theme: `frontend/src/theme.ts`
- Override colors, typography, spacing as needed
- See [Chakra Docs](https://chakra-ui.com/docs/styled-system/customize-theme)

---

## 🔒 Security & Quality

### Input Validation
- **Always validate** contact/quote form with Zod: `frontend/src/lib/validation.ts`
- Example:
```tsx
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message too short'),
});
```

### Error Handling
- ✅ Catch fetch errors and show friendly messages
- ✅ Log errors to Sentry
- ❌ Don't log form data or personal info to console
- ❌ Don't expose internal error messages to users

```tsx
try {
  const url = generateWhatsAppURL(message);
  window.open(url, '_blank');
} catch (error) {
  console.error('Error:', error);
  showToast({ title: 'Something went wrong. Please try again.' });
}
```

### Environment Variables
- **Frontend only supports `VITE_*` variables** (Vite convention)
- Set in `.env` files (never commit `.env.local`)
- No sensitive data in frontend (it's public)

### Performance
- ✅ Lazy load images with `ImageFallback.tsx`
- ✅ Use React Query for caching (future API calls)
- ✅ Keep bundle small: avoid installing large dependencies
- ❌ Don't fetch all data on page load

### Accessibility
- ✅ Chakra UI provides semantic HTML by default
- ✅ Use `aria-*` attributes for complex interactions
- ✅ Test with keyboard navigation (Tab key)
- ✅ Use meaningful link text ("Learn more" ≠ "Click here")

---

## 📐 Code Patterns & Examples

### Creating a New Page
1. Create `frontend/src/pages/MyPage.tsx`
2. Add route to `frontend/src/lib/router.tsx`
3. Add navigation link to `frontend/src/components/Header.tsx`

```tsx
// frontend/src/pages/MyPage.tsx
import { Helmet } from 'react-helmet-async';
import { Container, Heading } from '@chakra-ui/react';

export default function MyPage() {
  return (
    <>
      <Helmet>
        <title>My Page - TechFlow Solutions</title>
        <meta name="description" content="..." />
      </Helmet>
      <Container maxW="container.lg" py={8}>
        <Heading>My Page</Heading>
      </Container>
    </>
  );
}
```

### Creating a Reusable Component
Place in `components/common/` or `components/IT/`:
```tsx
// frontend/src/components/common/MyCard.tsx
import { Box, Heading } from '@chakra-ui/react';

interface MyCardProps {
  title: string;
  children: React.ReactNode;
}

export function MyCard({ title, children }: MyCardProps) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Heading size="md">{title}</Heading>
      {children}
    </Box>
  );
}
```

### Form with Validation
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validation';

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## ✅ Do's & ❌ Don'ts

| ✅ DO | ❌ DON'T |
|------|---------|
| Use TypeScript types everywhere | Use `any` or `unknown` without type narrowing |
| Validate form inputs with Zod | Trust user input |
| Generate WhatsApp URLs directly | Call a backend API for forms |
| Include `<Helmet>` in every page | Skip SEO meta tags |
| Use Chakra UI components | Import raw HTML elements |
| Keep dark mode in mind (`useColorModeValue`) | Hardcode colors |
| Log errors to Sentry | Print sensitive data to console |
| Test locally before pushing | Assume code works without testing |
| Use consistent naming conventions | Mix camelCase and PascalCase |
| Keep components focused & small | Build monolithic 500-line components |

---

## 📚 Documentation & References

- **[ARCHITECTURE.md](../docs/ARCHITECTURE.md)** - Detailed architecture, patterns, decisions
- **[DEPLOYMENT.md](../docs/DEPLOYMENT.md)** - Deployment on Vercel (auto-deploy on push to master)
- **[CHANGELOG.md](../docs/CHANGELOG.md)** - Version history and breaking changes
- **[PROJECT_INDEX.md](../docs/PROJECT_INDEX.md)** - Full project inventory
- **[SCRIPTS.md](../docs/SCRIPTS.md)** - Detailed command reference
- **[React Docs](https://react.dev)** - React 18 guide
- **[Chakra UI Docs](https://chakra-ui.com/docs)** - Component library reference
- **[Vite Docs](https://vitejs.dev)** - Build tool guide
- **[React Router v6 Docs](https://reactrouter.com)** - Navigation & routing

---

## 🎯 When Stuck

1. Check `docs/ARCHITECTURE.md` for design patterns
2. Search `frontend/src/pages/*.tsx` for similar examples
3. Refer to [Chakra UI components](https://chakra-ui.com/docs) for UI patterns
4. Test incrementally: `npm run dev` → make changes → save → hot-reload
5. Run `npm run build` and `npm test` before commits
