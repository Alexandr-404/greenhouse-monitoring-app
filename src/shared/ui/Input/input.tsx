import clsx from "clsx";
import styles from "./input.module.scss";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return <input className={clsx(styles.input, className)} {...rest} />;
}
