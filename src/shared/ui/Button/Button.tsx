import clsx from "clsx";
import styles from "./Button.module.scss";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className, ...rest }: Props) {
  return (
    <button
      className={clsx(styles.btn, styles[variant], className)}
      {...rest}
    />
  );
}
