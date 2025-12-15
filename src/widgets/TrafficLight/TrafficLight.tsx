import styles from "./TrafficLight.module.scss";

type Props = {
  normal: number;
  warning: number;
  alarm: number;
};

export function TrafficLight({ normal, warning, alarm }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.item}>
        <div className={styles.dot} aria-label="normal" />
        <div className={styles.label}>Норма</div>
        <div className={styles.value}>{normal}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.dot} aria-label="warning" />
        <div className={styles.label}>Предупреждение</div>
        <div className={styles.value}>{warning}</div>
      </div>
      <div className={styles.item}>
        <div className={styles.dot} aria-label="alarm" />
        <div className={styles.label}>Авария</div>
        <div className={styles.value}>{alarm}</div>
      </div>
    </div>
  );
}
