# PlayPowerLearn 🎮📚

**AI-Powered Educational Games for K-8 Learners**

A comprehensive Learning Management System (LMS) for AI-generated educational activities, built by Play Power Labs. Features gamified practice aligned to Common Core standards with an Indian-inspired design.

![PlayPowerLearn Banner](public/images/banner.png)

## ✨ Features

### For Teachers 👩‍🏫
- **Activity Library**: Browse and discover AI-generated activities aligned to Common Core standards
- **AI Generation**: Create new practice activities for any standard in seconds
- **Progressions**: Build learning paths with sequences of activities
- **Assignments**: Assign activities to classrooms with due dates
- **Analytics**: Track class and individual student progress
- **Standards Coverage**: Visual overview of standards covered

### For Students 🎓
- **Gamified Practice**: Engaging MCQ practice with instant feedback
- **XP & Levels**: Earn experience points and level up (Indian-themed level names)
- **Badges**: Collect achievement badges (50+ badges including secret ones)
- **Skill Trees**: Visual progression through math and literacy skills
- **Streaks**: Daily practice streaks with bonus rewards
- **Avatars**: Customizable student profiles

### For Parents 👨‍👩‍👧
- **Progress Tracking**: See what your children are learning
- **Grade Topics**: Understand what's covered at each grade level
- **Home Activities**: Offline activities to do with your kids
- **Resources**: Parent guides for supporting learning
- **Weekly Reports**: Summary of children's progress

## 🎨 Design System

Indian-inspired color palette:
- **Saffron** (#f97316): Primary action color
- **Peacock Blue** (#06b6d4): Secondary/student color
- **Lotus Pink** (#ec4899): Accent/parent color
- **Royal Gold** (#d4af37): Achievement/reward color
- **Emerald** (#10b981): Success color

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Indian-themed design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI / Anthropic Claude
- **Animation**: Framer Motion

## 📁 Project Structure

```
playpowerlearn/
├── prisma/              # Database schema and migrations
├── public/
│   └── images/
│       ├── badges/      # Badge icons
│       ├── avatars/     # Student avatars
│       └── backgrounds/ # Decorative patterns
├── src/
│   ├── app/
│   │   ├── teacher/     # Teacher portal pages
│   │   ├── student/     # Student portal pages
│   │   ├── parent/      # Parent portal pages
│   │   └── api/         # API routes
│   ├── components/
│   │   ├── common/      # Shared components
│   │   ├── teacher/     # Teacher-specific components
│   │   ├── student/     # Student-specific components
│   │   ├── parent/      # Parent-specific components
│   │   ├── gamification/# Badges, XP, skill trees
│   │   └── ui/          # Base UI components
│   ├── data/
│   │   ├── standards/   # Common Core standards data
│   │   ├── badges/      # Badge definitions
│   │   └── skill-trees/ # Skill tree configurations
│   ├── lib/
│   │   ├── ai/          # AI generation utilities
│   │   ├── db/          # Database utilities
│   │   ├── hooks/       # React hooks
│   │   └── utils/       # Helper functions
│   ├── styles/          # Global styles
│   └── types/           # TypeScript types
└── docs/                # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI or Anthropic API key

### Installation

1. Clone the repository:
```bash
cd playpowerlearn
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📚 Common Core Standards

The platform covers Common Core State Standards for:
- **Mathematics**: K-8 (all domains)
- **English Language Arts**: K-8 (Reading, Writing, Language)

Standards data is organized by:
- Grade level (K, 1-8)
- Domain (e.g., Operations & Algebraic Thinking)
- Cluster (group of related standards)
- Individual standards

## 🎮 Gamification System

### XP & Levels
- Students earn XP for completing activities
- Level names are inspired by Indian educational tradition:
  - Level 1: Shishya (Student)
  - Level 5: Acharya (Teacher)
  - Level 10: Param Guru (Supreme Master)

### Badges
- 50+ badges across categories:
  - Achievement (completing activities)
  - Streak (daily practice)
  - Mastery (skill completion)
  - Special (holidays, secrets)

### Skill Trees
- Visual representation of learning progress
- Skills unlock based on prerequisites
- Each skill has 5 mastery levels

## 🤖 AI-Generated Activities

Activities can be generated using AI:
- Specify grade, subject, and standard
- AI creates appropriate questions
- Automatic difficulty adjustment
- Human review before publishing

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔐 Authentication

Supports multiple authentication methods:
- Email/Password
- Google OAuth
- Microsoft OAuth (for schools)

## 📄 License

Copyright © 2024 Play Power Labs. All rights reserved.

## 🙏 Acknowledgments

- Common Core State Standards Initiative
- Indian mathematical tradition (Aryabhata, Brahmagupta)
- Indian literary tradition (Kalidasa, Valmiki)
