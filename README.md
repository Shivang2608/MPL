🏏 Fantasy Cricket App (React + Vite)

A fully responsive Fantasy Cricket Web App built using React + Vite, featuring team selection, player roles, captain/vice-captain selection, match listings, sidebar navigation, and localStorage persistence.

This project replicates the core logic of fantasy platforms like Dream11 — pick players, assign C/VC, and save your teams.

🚀 Features
✅ Match Listing

Shows all upcoming matches

Click any match to start team creation

Fully responsive UI

✅ Player Selection

Select 11 players

Shows player role counts (WK, BAT, AR, BOWL)

Auto-updates selection count

Displays credit usage

Prevents overselecting

✅ Captain & Vice-Captain Selection

Clean, mobile-friendly screen

Highlights selected C & VC

Prevents assigning both roles to same player

Save Team button visible on all screens

✅ My Teams

Stores all created teams in localStorage

Shows teams by match

Lets you edit existing teams

✅ Sidebar Navigation

Desktop = always visible left sidebar

Mobile = hamburger opens a sliding drawer

Pages:

Home

My Matches

My Teams

Refer & Earn

Gemz Coins

Games

✅ Tech Stack

React

Vite

Tailwind CSS

LocalStorage API

Lucide Icons

📂 Project Structure
src/
│── components/
│   ├── Sidebar.jsx
│── pages/
│   ├── Home.jsx
│   ├── UpcomingMatches.jsx
│   ├── PickPlayersPage.jsx
│   ├── PickCaptainPage.jsx
│   ├── MyTeamsPage.jsx
│── App.jsx
│── main.jsx
│── data/
│   ├── matches.json (optional)

🛠️ Installation & Setup
1️⃣ Clone the Repo
git clone https://github.com/yourusername/fantasy-app<img width="1900" height="910" alt="Screenshot 2025-11-22 165518" src="https://github.com/user-attachments/assets/d11299a2-dec7-4354-8a8b-ead2915de614" /><img width="744" height="846" alt="Screenshot 2025-11-22 171255" src="https://github.com/user-attachments/assets/252ce5c1-c6be-4aa6-856d-709df9a30645" />
<img width="864" height="907" alt="Screenshot 2025-11-22 171214" src="https://github.com/user-attachments/assets/c592c381-d6d1-44f9-95c2-73767fb15549" />
<img width="860" height="923" alt="Screenshot 2025-11-22 171131" src="https://github.com/user-attachments/assets/897ded84-dd06-463e-9c7c-1deeb96fe9cd" />
<img width="852" height="919" alt="Screenshot 2025-11-22 171119" src="https://github.com/user-attachments/assets/a3bcbccd-a860-4acf-9822-3762ad37a6c9" />
<img width="860" height="920" alt="Screenshot 2025-11-22 171105" src="https://github.com/user-attachments/assets/adce6bcc-9f95-4c64-afdb-2a37eade4187" />
<img width="1363" height="907" alt="Screenshot 2025-11-22 165657" src="https://github.com/user-attachments/assets/2cd48e66-7010-4c69-af3c-5bbd702aef90" />
<img width="1902" height="826" alt="Screenshot 2025-11-22 165602" src="https://github.com/user-attachments/assets/53be0c49-9bdb-4333-a87c-8cd5dafca283" />
<img width="1913" height="910" alt="Screenshot 2025-11-22 165546" src="https://github.com/user-attachments/assets/6d8d9ddb-272d-4bcc-bebe-bfb13e18c433" />
<img width="1883" height="881" alt="Screenshot 2025-11-22 165535" src="https://github.com/user-attachments/assets/38d37816-e6bf-44f5-a8be-2d1e3a9572a8" />


2️⃣ Install Dependencies
npm install

3️⃣ Start Dev Server
npm run dev


App runs on:(http://localhost:5173/)
