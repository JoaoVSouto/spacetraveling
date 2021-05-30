import styles from './postsNavigation.module.scss';

type PostsNavigationProps = {
  className?: string;
};

export default function PostsNavigation({
  className = '',
}: PostsNavigationProps): JSX.Element {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.postNavigation}>
        <p>Como utilizar Hooks</p>
        <a href="#!">Post anterior</a>
      </div>
      <div className={styles.postNavigation}>
        <p>Criando um app CRA do Zero</p>
        <a href="#!">Próximo post</a>
      </div>
    </div>
  );
}
