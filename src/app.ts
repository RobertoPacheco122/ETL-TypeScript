import ReadLine from "readline";
import FileSistem from "fs";
import database from "./database";
import userConfig from "./userConfig";

const createInsertSql = () => {
  const placeholders = tableColumns.map((column, index) => `$${index + 1}`);
  return `INSERT INTO ${
    userConfig.tableToInsert
  } (${tableColumns.toString()}) VALUES (${placeholders})`;
};

const insertDataIntoTable = async (
  sqlComand: string,
  values: Array<string | number | boolean>
) => {
  const { rows } = await database.query(sqlComand, [...values]);

  if (!rows) console.log(`Ocorreu algum erro ao inserir a linha ${rowNumber}`);
  else console.log(`Linha ${rowNumber} inserida com sucesso na tabela`);
};

const line = ReadLine.createInterface({
  input: FileSistem.createReadStream(userConfig.filePath),
});

const tableColumns: string[] = [];
let rowNumber = 0;

line.on("line", async (fileRow) => {
  const csvLine = fileRow.split(userConfig.colunsDelimiter);
  if (!csvLine)
    throw new Error(
      "O arquivo não possui dados ou o delimitador de colunas informado é incorreto"
    );

  if (tableColumns.length == 0) tableColumns.push(...csvLine);
  else {
    try {
      const insertSqlCommand = createInsertSql();
      await insertDataIntoTable(insertSqlCommand, [...csvLine]);
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }

  rowNumber += 1;
});

line.on("close", () => {
  database.end();
});
