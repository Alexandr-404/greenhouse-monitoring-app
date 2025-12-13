import clsx from "clsx";
import styles from "./Card.module.scss";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div className={clsx(styles.card, className)} {...rest} />;
}
