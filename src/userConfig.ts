import dotenv from "dotenv";
dotenv.config();

const userConfig = {
  tableToInsert: "tasks",
  colunsDelimiter: ";",
  filePath: "teste.csv",
};

export default userConfig;
