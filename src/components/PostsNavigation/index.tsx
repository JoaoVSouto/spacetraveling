import Link from 'next/link';

import styles from './postsNavigation.module.scss';

type AdjacentPost = {
  slug: string;
  title: string;
};

type PostsNavigationProps = {
  className?: string;
  nextPost: AdjacentPost | null;
  previousPost: AdjacentPost | null;
};

export default function PostsNavigation({
  className = '',
  nextPost,
  previousPost,
}: PostsNavigationProps): JSX.Element {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.postNavigation}>
        {previousPost && (
          <>
            <p>{previousPost.title}</p>
            <Link href={`/post/${previousPost.slug}`}>
              <a>Post anterior</a>
            </Link>
          </>
        )}
      </div>
      {nextPost && (
        <div className={styles.postNavigation}>
          <p>{nextPost.title}</p>
          <Link href={`/post/${nextPost.slug}`}>
            <a>Próximo post</a>
          </Link>
        </div>
      )}
    </div>
  );
}
