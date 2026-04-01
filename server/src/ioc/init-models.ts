import { Sequelize } from "sequelize";
import { initDTOLoginDetailModel } from "../0.logindetail/7.dto.model";
import { initDTOSchoolModel } from "../1.school/7.dto.model";
import { initDTOSchoolStandardModel } from "../2.schoolstandard/7.dto.model";
import { initDTOStudentModel } from "../3.student/7.dto.model";
import { initDTOProgressModel } from "../4.progress/7.dto.model";
import { initDTOStandardModel } from "../5.standard/7.dto.model";
import { initDTOSStandardSubjectModel } from "../6.standardsubject/7.dto.model";
import { initDTOSubjectModel } from "../6.subject/7.dto.model";
import { initDTOLessonModel } from "../7.lesson/7.dto.model";
import { initDTOLessonSectionModel } from "../7.lessonsection/7.dto.model";


export const ensureSchema = async (
  sequelize: Sequelize,
  schemaName: string
) => {
  await sequelize.createSchema(schemaName, { logging: false }).catch(() => {});
};

export async function initModels(schemaName: string, sequelize: Sequelize) {
  initDTOLoginDetailModel(schemaName, sequelize);
  initDTOSchoolModel(schemaName, sequelize);
  initDTOSchoolStandardModel(schemaName, sequelize);
  initDTOStandardModel(schemaName, sequelize);
  initDTOSStandardSubjectModel(schemaName, sequelize);
  initDTOSubjectModel(schemaName, sequelize);
  initDTOLessonModel(schemaName, sequelize);
  initDTOLessonSectionModel(schemaName, sequelize);

  initDTOStudentModel(schemaName, sequelize);
  initDTOProgressModel(schemaName, sequelize);

  console.log(`Models initialized for tenant: ${schemaName}`);
  await ensureSchema(sequelize, "tenanta");
  await sequelize.sync();
}
