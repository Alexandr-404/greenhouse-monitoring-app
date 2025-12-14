import { Link, Outlet } from "react-router-dom";

import styles from "./App.module.scss";
import { RoleSwitch } from "../features/authRole";

export function App() {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Система мониторинга
        </Link>
        <RoleSwitch />
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
