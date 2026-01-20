import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../utils/session";
import type { UserType } from "../types";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: UserType[];
}

/**
 * 인증된 사용자만 접근 가능한 라우트 보호 컴포넌트
 * - 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
 * - allowedUserTypes가 지정된 경우, 해당 사용자 타입만 접근 가능
 */
const PrivateRoute = ({ children, allowedUserTypes }: PrivateRouteProps) => {
  const user = getCurrentUser();
  const location = useLocation();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 허용된 사용자 타입이 지정된 경우 권한 확인
  if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
    // 권한이 없는 경우 사용자의 기본 대시보드로 리다이렉트
    const defaultPaths: Record<UserType, string> = {
      STUDENT: "/student/dashboard",
      PARENT: "/parent/dashboard",
      SCHOOL_ADMIN: "/school-admin/dashboard",
      ASSESSMENT_TEACHER: "/teacher/dashboard",
      QUESTION_DEVELOPER: "/question-dev/dashboard",
      SYSTEM_ADMIN: "/admin/dashboard",
    };
    return <Navigate to={defaultPaths[user.userType]} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
