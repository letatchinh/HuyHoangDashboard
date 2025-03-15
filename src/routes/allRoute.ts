import { PathRouteProps } from 'react-router-dom';
import { AUTH, PATH_APP } from "./allPath";
import Homepage from "~/pages/Homepage";
import Course from "~/pages/Course";
import CourseForm from '~/modules/course/components/CourseForm';
import CourseUpdateForm from '~/modules/course/components/CourseUpdateForm';
import Login from '~/modules/auth/screens/Login';
import StaffPage from '~/pages/Staff';
import { CourseGroupForm, CourseGroupScreen } from '~/modules/courseGroup';
import Teacher from "~/pages/Teacher";
import TeacherForm from '~/modules/teacher/components/TeacherForm';
import { TestList, TestCreate, TestDetail } from '~/modules/test';

export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },
  { path: PATH_APP.course.root, Component: Course },
  { path: PATH_APP.course.create, Component: CourseForm },
  { path: PATH_APP.course.update, Component: CourseUpdateForm },
  { path: PATH_APP.staff.root, Component: StaffPage },
  
  { path: PATH_APP.courseGroup.root, Component: CourseGroupScreen },
  { path: PATH_APP.courseGroup.create, Component: CourseGroupForm },
  { path: PATH_APP.courseGroup.update, Component: CourseGroupForm },

  { path: PATH_APP.teacher.root, Component: Teacher },
  { path: PATH_APP.teacher.create, Component: TeacherForm },
  { path: PATH_APP.teacher.update, Component: TeacherForm },
  { path: PATH_APP.test.root, Component: TestList },
  { path: PATH_APP.test.create, Component: TestCreate },
  { path: PATH_APP.test.detail, Component: TestDetail },
  
  

  { path: '/', Component: Homepage },
]
export const authRoutes: PathRouteProps[] = [
  { path: AUTH.login, Component: Login },
];



