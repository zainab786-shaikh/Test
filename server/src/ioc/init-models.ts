import { Sequelize } from "sequelize";
import { initDTOSchoolModel } from "../1.school/7.dto.model";
import { initDTOStudentModel } from "../3.student/7.dto.model";
import { initDTOStandardModel } from "../5.standard/7.dto.model";
import { initDTOSubjectModel } from "../6.subject/7.dto.model";
import { initDTOContentModel } from "../content/7.dto.model";
import { initDTOProgressModel } from "../4.progress/7.dto.model";

export async function initModels(schemaName: string, sequelize: Sequelize) {
  initDTOSchoolModel(schemaName, sequelize);
  initDTOStudentModel(schemaName, sequelize);

  initDTOStandardModel(schemaName, sequelize);
  initDTOSubjectModel(schemaName, sequelize);
  initDTOContentModel(schemaName, sequelize);
  initDTOProgressModel(schemaName, sequelize);
  sequelize.sync();
}
