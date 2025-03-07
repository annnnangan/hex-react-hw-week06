import { NavLink, Outlet } from "react-router-dom";

const routes = [
  { path: "/", name: "首頁" },
  { path: "/products", name: "產品列表" },
  { path: "/cart", name: "購物車" },
];

const FrontLayout = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#">
            <img
              src="https://plus.unsplash.com/premium_photo-1661962960694-0b4ed303744f?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Logo"
              width="60"
              height="60"
              className="d-inline-block align-text-top object-fit-cover rounded-circle"
            />
            UUUUUUdemyyyy
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {routes.map((route) => (
                <li className="nav-item" key={route.path}>
                  <NavLink className="nav-link" aria-current="page" to={route.path}>
                    {route.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default FrontLayout;
