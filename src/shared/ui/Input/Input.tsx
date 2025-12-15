import clsx from "clsx";
import styles from "./Input.module.scss";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input className={clsx(styles.input, className)} {...rest} />;
}
