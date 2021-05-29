import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './post.module.scss';

type PostModel = {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
};

type PostProps = {
  post: PostModel;
};

export default function Post({ post }: PostProps): JSX.Element {
  return (
    <article className={styles.container}>
      <Link href={`/post/${post.uid}`}>
        <a>
          <h3>{post.data.title}</h3>
          <p>{post.data.subtitle}</p>
          <div>
            <time>
              <FiCalendar size={20} />
              {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                locale: ptBR,
              })}
            </time>
            <small>
              <FiUser size={20} />
              {post.data.author}
            </small>
          </div>
        </a>
      </Link>
    </article>
  );
}
