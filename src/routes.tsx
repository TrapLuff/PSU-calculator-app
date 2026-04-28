export const ROUTES = {
  HOME: "/",
  COMPONENTS: "/components",
  COMPONENT_DETAIL: "/components/:id",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  HOME: "Главная",
  COMPONENTS: "Компоненты",
  COMPONENT_DETAIL: "Компонент",
};