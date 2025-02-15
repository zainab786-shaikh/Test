export interface ILoginDetail {
  Id?: number;
  name: string;
  password: string;
  role: "admin" | "teacher" | "student" | "parent";
}
