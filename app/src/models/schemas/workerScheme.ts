// Libs
import { ModelAttributes, STRING, UUIDV4, UUID } from "sequelize";

// Schema
const WorkerScheme: ModelAttributes = {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  },
  first_name: {
    type: STRING,
    allowNull: false,
  },
  last_name: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
};

// Code
export default WorkerScheme;
