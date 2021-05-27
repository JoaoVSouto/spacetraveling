import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | spacetraveling.</title>
      </Head>

      <main className={styles.container}>
        <article>
          <a href="#!">
            <h3>Como utilizar Hooks</h3>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <time>
                <FiCalendar size={20} />
                15 Mar 2021
              </time>
              <small>
                <FiUser size={20} />
                João Vítor
              </small>
            </div>
          </a>
        </article>
        <article>
          <a href="#!">
            <h3>Criando um app CRA do zero</h3>
            <p>
              Tudo sobre como criar a sua primeira aplicação utilizando Create
              React App
            </p>
            <div>
              <time>
                <FiCalendar size={20} />
                15 Mar 2021
              </time>
              <small>
                <FiUser size={20} />
                João Vítor
              </small>
            </div>
          </a>
        </article>

        <button type="button">Carregar mais posts</button>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
