export const ROUTES = {
  HOME: "/",
  COMPONENTS: "/components",
  COMPONENT_DETAIL: "/components/:id",
  POWERS: "/powers",
  POWER_DETAIL: "/powers/:id",
  LOGIN: "/login",
  REGISTER: "/register",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  COMPONENTS: "Компоненты",
  COMPONENT_DETAIL: "Компонент",
  POWERS: "Конфигурации",
  POWER_DETAIL: "Конфигурация",
  LOGIN: "Логин",
  REGISTER: "Регистрация",
};