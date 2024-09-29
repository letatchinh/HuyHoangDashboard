import { PathRouteProps } from 'react-router-dom';
import { PATH_APP } from "./allPath";
import Homepage from "~/pages/Homepage";
import Course from "~/pages/Course";
import CourseForm from '~/modules/course/components/CourseForm';
import CourseUpdateForm from '~/modules/course/components/CourseUpdateForm';
import CourseGroup from "~/pages/CourseGroup";
import CourseGroupForm from '~/modules/courseGroup/components/CourseGroupForm';

export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },
  { path: PATH_APP.course.root, Component: Course },
  { path: PATH_APP.course.create, Component: CourseForm },
  { path: PATH_APP.course.update, Component: CourseUpdateForm },
  
  { path: PATH_APP.courseGroup.root, Component: CourseGroup },
  { path: PATH_APP.courseGroup.create, Component: CourseGroupForm },
  { path: PATH_APP.courseGroup.update, Component: CourseGroupForm },
  
  

  { path: '/', Component: Homepage },
]


