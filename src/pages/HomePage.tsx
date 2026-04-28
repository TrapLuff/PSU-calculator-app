import type { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes";
import { Button } from "react-bootstrap";
import { HeaderComponent } from "../components/Header";

export const HomePage: FC = () => {
  return (
    <main>
      <HeaderComponent crumbs={[]}/>
      <hr />

      <div className="body-up" style={{ justifyContent: "center"}}>
        <Link to={ROUTES.COMPONENTS}>
          <Button variant="warning">
            Компоненты
          </Button>
        </Link>
      </div>

    </main>
  );
};