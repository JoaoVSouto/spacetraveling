import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  const { route } = useRouter();

  const isOnHome = route === '/';

  return (
    <header className={`${styles.container} ${isOnHome ? styles.home : ''}`}>
      <Link href="/">
        <a>
          <img src="/assets/logo.svg" alt="logo" />
        </a>
      </Link>
    </header>
  );
}
