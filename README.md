# Recruiter Directory Application

A modern, zero-cost Next.js application for browsing and connecting with technical recruiters worldwide. The application features country-specific subdomains, search and filtering capabilities, and direct LinkedIn integration.

## Features

- 🌍 **Multi-country Support**: Browse recruiters by country (US, UK, Canada, Australia, India)
- 🔍 **Advanced Search**: Search by name, company, specialization, or bio
- 🎯 **Smart Filtering**: Filter recruiters by specialization
- 📱 **Responsive Design**: Modern, intuitive UI that works on all devices
- 🔗 **LinkedIn Integration**: Direct links to recruiter LinkedIn profiles
- ⚡ **Zero Cost**: Fully hosted on Vercel with JSON-based data storage
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd techinical-recuiters
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Local Development with Subdomains

For local development with subdomain routing:

1. Edit your `/etc/hosts` file (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):
```
127.0.0.1 us.localhost
127.0.0.1 uk.localhost
127.0.0.1 ca.localhost
127.0.0.1 au.localhost
127.0.0.1 in.localhost
```

2. Access the app via subdomains:
- http://us.localhost:3000
- http://uk.localhost:3000
- etc.

Alternatively, you can access directly via path routing:
- http://localhost:3000/us
- http://localhost:3000/uk
- etc.

## Project Structure

```
/
├── app/
│   ├── [country]/              # Country-specific pages
│   │   ├── page.tsx           # Directory listing
│   │   └── recruiters/
│   │       └── [id]/
│   │           └── page.tsx   # Individual recruiter profile
│   ├── api/
│   │   └── recruiters/
│   │       └── route.ts       # API endpoint
│   └── layout.tsx              # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Header.tsx             # Navigation header
│   ├── RecruiterCard.tsx      # Recruiter card component
│   ├── RecruiterGrid.tsx      # Grid/list view
│   ├── SearchBar.tsx          # Search input
│   └── FilterPanel.tsx        # Filter sidebar
├── data/
│   ├── us.json                # US recruiters data
│   ├── uk.json                # UK recruiters data
│   ├── ca.json                # Canada recruiters data
│   ├── au.json                # Australia recruiters data
│   └── in.json                # India recruiters data
├── lib/
│   ├── data.ts                # Data fetching utilities
│   ├── subdomain.ts           # Subdomain detection
│   └── utils.ts               # General utilities
├── types/
│   └── recruiter.ts           # TypeScript types
└── middleware.ts              # Subdomain routing middleware
```

## Data Management

Recruiter data is stored in JSON files in the `/data` directory. Each country has its own file:

- `us.json` - United States recruiters
- `uk.json` - United Kingdom recruiters
- `ca.json` - Canada recruiters
- `au.json` - Australia recruiters
- `in.json` - India recruiters

### Adding Recruiters

To add a new recruiter, edit the appropriate country JSON file:

```json
{
  "id": "country-code-1",
  "name": "Recruiter Name",
  "country": "US",
  "company": "Company Name",
  "specialization": ["Specialization 1", "Specialization 2"],
  "experience": "X years",
  "bio": "Recruiter bio and description",
  "linkedinUrl": "https://linkedin.com/in/recruiter-profile",
  "imageUrl": "/images/recruiters/recruiter.jpg"
}
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Configure subdomains in your domain settings:
   - Add wildcard subdomain: `*.yourdomain.com`
   - Or add individual subdomains: `us.yourdomain.com`, `uk.yourdomain.com`, etc.
4. Deploy!

### Subdomain Configuration

For subdomain routing to work:

1. **DNS Configuration**: Add a wildcard A record pointing to Vercel:
   - Type: `A`
   - Name: `*`
   - Value: Vercel's IP addresses

2. **Vercel Domain Settings**: Add your domain and enable wildcard subdomains

3. The middleware will automatically detect the subdomain and route to the appropriate country page.

## Environment Variables

No environment variables are required for basic functionality. The application uses JSON files for data storage.

## Features in Detail

### Search
- Search across recruiter names, companies, specializations, and bios
- Real-time filtering as you type

### Filtering
- Filter by specialization
- Combine with search for precise results

### View Modes
- **Grid View**: Card-based layout (default)
- **List View**: Compact list layout

### Country Switching
- Use the country selector in the header
- Automatically redirects to the selected country's subdomain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.
