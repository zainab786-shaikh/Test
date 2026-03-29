import { QueryInterface, Sequelize } from "sequelize";
import * as fs from "fs";
import * as path from "path";

export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    const schema = "tenanta";
    const tableName = "logindetail";
    const hashedPassword = "admin";

    // 1. Insert your admin record
    await queryInterface.bulkInsert(
      { schema, tableName },
      [
        {
          name: "admin",
          adhaar: "111111111111",
          password: hashedPassword,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ]
    );

    // 2. Execute SQL files
    // Assuming your SQL files are in a folder named 'sql' in your project root
    const sqlFolderPath = path.join(__dirname, "../../sql"); 
    const sqlFiles = ["initial_tables.sql", "functions.sql"]; // List your files here

    for (const file of sqlFiles) {
      const filePath = path.join(sqlFolderPath, file);
      const sql = fs.readFileSync(filePath, "utf8");
      
      console.log(`Executing ${file}...`);
      await queryInterface.sequelize.query(sql);
    }
  },

  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    const schema = "tenanta";
    const tableName = "logindetail";
    await queryInterface.bulkDelete({ schema, tableName }, { name: "admin" });
    
    // Note: You may need to add DROP statements here if your SQL files created tables
  },
};