import { Container } from "inversify";
import TYPES from "./types";

import { BaseController } from "../common/base-controller";
import { ILogger, LoggerService } from "../common/service/logger.service";
import { ServiceTenant } from "../common/service/tenant.service";
import { RequestContextProvider } from "../common/service/request-context.service";
import { MiddlewareProvider } from "../common/service/middleware.service";

import { ControllerStudent } from "../student/2.controller";
import { IServiceStudent } from "../student/3.service.model";
import { ServiceStudentImpl } from "../student/4.service";
import { IRepoStudent } from "../student/5.repo.model";
import { RepoStudentImpl } from "../student/6.repo";
import { Validate } from "../common/validate";
import { ControllerSchool } from "../school/2.controller";
import { IServiceSchool } from "../school/3.service.model";
import { ServiceSchoolImpl } from "../school/4.service";
import { IRepoSchool } from "../school/5.repo.model";
import { RepoSchoolImpl } from "../school/6.repo";
import { ControllerStandard } from "../standard/2.controller";
import { IServiceStandard } from "../standard/3.service.model";
import { ServiceStandardImpl } from "../standard/4.service";
import { IRepoStandard } from "../standard/5.repo.model";
import { RepoStandardImpl } from "../standard/6.repo";
import { ControllerSubject } from "../subject/2.controller";
import { IServiceSubject } from "../subject/3.service.model";
import { ServiceSubjectImpl } from "../subject/4.service";
import { IRepoSubject } from "../subject/5.repo.model";
import { RepoSubjectImpl } from "../subject/6.repo";
import { ControllerContent } from "../content/2.controller";
import { IServiceContent } from "../content/3.service.model";
import { ServiceContentImpl } from "../content/4.service";
import { IRepoContent } from "../content/5.repo.model";
import { RepoContentImpl } from "../content/6.repo";

const container = new Container();
container.bind<ILogger>(TYPES.LoggerService).to(LoggerService);
container.bind(ServiceTenant).toSelf().inSingletonScope();
container.bind(RequestContextProvider).toSelf().inSingletonScope();
container.bind(MiddlewareProvider).toSelf().inSingletonScope();
container.bind<Validate>(Validate).to(Validate);

container.bind<ControllerSchool>(TYPES.ControllerSchool).to(ControllerSchool);
container.bind<IServiceSchool>(TYPES.ServiceSchool).to(ServiceSchoolImpl);
container.bind<IRepoSchool>(TYPES.RepoSchool).to(RepoSchoolImpl);

container
  .bind<ControllerStudent>(TYPES.ControllerStudent)
  .to(ControllerStudent);
container.bind<IServiceStudent>(TYPES.ServiceStudent).to(ServiceStudentImpl);
container.bind<IRepoStudent>(TYPES.RepoStudent).to(RepoStudentImpl);

container
  .bind<ControllerStandard>(TYPES.ControllerStandard)
  .to(ControllerStandard);
container.bind<IServiceStandard>(TYPES.ServiceStandard).to(ServiceStandardImpl);
container.bind<IRepoStandard>(TYPES.RepoStandard).to(RepoStandardImpl);

container
  .bind<ControllerSubject>(TYPES.ControllerSubject)
  .to(ControllerSubject);
container.bind<IServiceSubject>(TYPES.ServiceSubject).to(ServiceSubjectImpl);
container.bind<IRepoSubject>(TYPES.RepoSubject).to(RepoSubjectImpl);

container
  .bind<ControllerContent>(TYPES.ControllerContent)
  .to(ControllerContent);
container.bind<IServiceContent>(TYPES.ServiceContent).to(ServiceContentImpl);
container.bind<IRepoContent>(TYPES.RepoContent).to(RepoContentImpl);
export { container };
