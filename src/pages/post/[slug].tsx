import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(): JSX.Element {
  return (
    <>
      <Head>
        <title>Lorem Ipsum | spacetraveling.</title>
      </Head>

      <img
        src="https://hallcpas.com/wp-content/uploads/2018/01/mountains-min-1440x400.jpg"
        alt="Mountains"
        className={styles.banner}
      />

      <main className={styles.container}>
        <h1>Criando um app CRA do zero</h1>

        <div className={styles.postInfo}>
          <time>
            <FiCalendar size={20} />
            15 Mar 2021
          </time>
          <span>
            <FiUser size={20} />
            João Vítor
          </span>
          <span>
            <FiClock size={20} /> 4 min
          </span>
        </div>

        <div className={styles.content}>
          <h3>Proin et varius</h3>

          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo,
            explicabo!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            nisi unde dolorum nihil, sequi consequuntur pariatur doloribus quam
            quis molestias. Facere obcaecati iure, sint voluptas neque officia
            optio! A ullam sed maxime maiores quisquam quia quis, eaque
            veritatis sunt laboriosam saepe iste recusandae tempora culpa quo
            expedita doloremque beatae perspiciatis.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis,
            iure quam dolore animi vel a.
          </p>
        </div>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
