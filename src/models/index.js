import sequelize from "../config/database.js";
import Produto from "./Produto.js";

const models = {
  Produto: Produto.initModel(sequelize),
};

export { sequelize };
export default models;
