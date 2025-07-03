## STEMQuest

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Firebase Project (for authentication and user data)
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/helenzhouu/quest.git
cd stem-quest
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password provider
   - Create a Firestore database
   - Copy your Firebase config values

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Firebase and API configuration values
```

5. Start the development server:
```bash
npm start
```

5. Run on your device:
```bash
# For iOS
npm run ios

# For Android
npm run android
```
