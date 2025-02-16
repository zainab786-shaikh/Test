import { QueryInterface, Sequelize } from "sequelize";
//import bcrypt from "bcrypt";

export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    const schema = "tenanta"; // Specify the schema
    const tableName = "logindetail";

    //const hashedPassword = await bcrypt.hash("adminpassword", 10); // Secure password
    const hashedPassword = "admin";

    await queryInterface.bulkInsert(
      { schema, tableName }, // Insert into the correct schema
      [
        {
          name: "admin",
          password: hashedPassword,
          role: "admin",
        },
      ]
    );
  },

  down: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    const schema = "tenanta";
    const tableName = "logindetail";

    await queryInterface.bulkDelete({ schema, tableName }, { name: "admin" });
  },
};
