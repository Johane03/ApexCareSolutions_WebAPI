# ApexCareSolutions_WebAPI
# ApexCareSolutions_WebAPI

## Prerequisites:
- **SQL Server Management Studio (SSMS)**: Ensure SSMS is installed to manage your database.
- **Visual Studio**: Required for running the backend (ASP.NET Web API).
- **Node.js**: Required for running the frontend (React).
- **Visual Studio Code**: Recommended for managing the frontend.

## SQL Database Setup:
1. Open `Database Script.sql` in **Microsoft SQL Server Management Studio (SSMS)**.
2. Execute the script to create and populate the database.

## API - Backend Setup:
1. Navigate to the `aspAPI` folder and open the `aspAPI.sln` file using **Visual Studio**.
2. In **Visual Studio**, go to `View` > `SQL Server Object Explorer`.
3. Check if `ApexCareSolutionsDB` is listed under your `SQL Server` > `Databases`. This confirms that your database is connected.
4. Run the API application in **Visual Studio** by selecting `https://localhost:{port}` from the debug options.

   ![img.png](img.png)

   > **Note:** 
   > A Swagger UI will open in your browser. You can ignore this as it is just to test the connection between your API and database.

## React - Frontend Setup:
1. Open the `aspFrontend` folder in **Visual Studio Code**.
2. Open a new terminal by navigating to `Terminal` > `New Terminal`.
3. Change the directory to the `client-app` folder by running:
   ```bash
   cd client-app
   ```
4. Install the required dependencies by running:
   ```bash
   npm install or npm i
   ```
5. Run the React frontend by typing:
   ```bash
   npm start
   ```

   > **Note:** Ensure the API is running in the background before starting the frontend.


