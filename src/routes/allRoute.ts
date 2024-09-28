import { PathRouteProps } from 'react-router-dom';
import { AUTH, PATH_APP } from "./allPath";
import Homepage from "~/pages/Homepage";
import Course from "~/pages/Course";
import CourseForm from '~/modules/course/components/CourseForm';
import CourseUpdateForm from '~/modules/course/components/CourseUpdateForm';
import Login from '~/modules/auth/screens/Login';

export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },
  { path: PATH_APP.course.root, Component: Course },
  { path: PATH_APP.course.create, Component: CourseForm },
  { path: PATH_APP.course.update, Component: CourseUpdateForm },
  
  

  { path: '/', Component: Homepage },
]
export const authRoutes: PathRouteProps[] = [
  { path: AUTH.login, Component: Login },
];



