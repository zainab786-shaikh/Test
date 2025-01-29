import { Sequelize } from "sequelize";
import { initDTOSchoolModel } from "../school/7.dto.model";
import { initDTOStudentModel } from "../student/7.dto.model";
import { initDTOStandardModel } from "../standard/7.dto.model";
import { initDTOSubjectModel } from "../subject/7.dto.model";
import { initDTOContentModel } from "../content/7.dto.model";
import { initDTOProgressModel } from "../progress/7.dto.model";

export async function initModels(schemaName: string, sequelize: Sequelize) {
  initDTOSchoolModel(schemaName, sequelize);
  initDTOStudentModel(schemaName, sequelize);

  initDTOStandardModel(schemaName, sequelize);
  initDTOSubjectModel(schemaName, sequelize);
  initDTOContentModel(schemaName, sequelize);
  initDTOProgressModel(schemaName, sequelize);
  sequelize.sync();
}
