// eslint-disable-next-line import/no-extraneous-dependencies
import { useMemo } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './postShimmer.module.scss';

type PostShimmerProps = {
  quantity?: number;
};

export default function PostShimmer({
  quantity = 1,
}: PostShimmerProps): JSX.Element {
  const generator = useMemo(
    () => Array(quantity).fill(0).map(Math.random),
    [quantity]
  );

  return (
    <>
      {generator.map(value => (
        <div key={value} className={styles.container}>
          <div className={`${styles.title} ${styles.shimmer}`} />
          <div className={`${styles.subtitle} ${styles.shimmer}`} />
          <div className={styles.infoContainer}>
            <div className={styles.date}>
              <FiCalendar size={20} />
              <div className={styles.shimmer} />
            </div>
            <div className={styles.author}>
              <FiUser size={20} />
              <div className={styles.shimmer} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
