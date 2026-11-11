# StyleSync - Module 1 (React + Express + MySQL + Sequelize ORM)

## 1. Create the database (once)
sudo mysql -e "CREATE DATABASE stylesync;"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword'; FLUSH PRIVILEGES;"

## 2. Backend
cd backend
cp .env.example .env     (then put your MySQL password inside .env)
npm install
npm start                (Sequelize creates the tables automatically)

## 3. Frontend (new terminal)
cd frontend
npm install
npm run dev              (open http://localhost:5173)

## Code layout (one folder per feature, backend and frontend)
1. Register, login, profile   backend/features/auth            frontend/src/features/auth
2. Fashion profile            backend/features/fashionProfile  frontend/src/features/fashionProfile
3. Upload and manage clothes  backend/features/wardrobe        frontend/src/features/wardrobe
4. Search and filter          backend/features/clothingFilter  frontend/src/features/clothingFilter

## ORM
Models (one file per table) are in backend/models. Routes use them
(User.findOne, Clothing.create ...) instead of writing SQL.
