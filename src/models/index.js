import sequelize from "../config/database.js";
import Produto from "./Produto.js";
import User from "./User.js";

const models = {
  Produto: Produto.initModel(sequelize),
  User: User.initModel(sequelize)
};

export { sequelize };
export default models;
