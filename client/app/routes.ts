import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/Homepage.tsx", [
    index("routes/Index.tsx"),
    route("Games", "routes/Games.tsx"),
    route("Shopping", "routes/Shopping.tsx"),
    route("Register", "routes/Register.tsx"),
    route("Signin", "routes/Signin.tsx"),
    route("google/redirect", "routes/GoogleRedirect.tsx"),
  ]),
  layout("routes/AuthLayout.tsx", [
    route("Account", "routes/Account.tsx"),
    route("Checkout", "routes/Checkout.tsx"),
    route("OrderComplete", "routes/OrderComplete.tsx"),
  ]),
  layout("routes/admin/AdminLayout.tsx", [
    route("/admin/CreateGame", "routes/admin/CreateGame.tsx"),
    route("/admin/UpdateGame", "routes/admin/UpdateGame.tsx"),
    route("/admin/DeleteGame", "routes/admin/DeleteGame.tsx"),
  ]),
] satisfies RouteConfig;
