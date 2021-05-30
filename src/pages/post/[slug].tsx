import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import TeaLoading from '../../components/TeaLoading';
import PostsNavigation from '../../components/PostsNavigation';
import PostComments from '../../components/PostComments';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  latestEditionDate: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
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

interface AdjacentPost {
  slug: string;
  title: string;
}

interface PostProps {
  post: Post;
  nextPost: AdjacentPost | null;
  previousPost: AdjacentPost | null;
}

const AVERAGE_READING_WORDS_PER_MINUTE = 200;

export default function Post({
  post,
  nextPost,
  previousPost,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <>
        <Head>
          <title>Carregando... | spacetraveling.</title>
        </Head>

        <main className={styles.container}>
          <div className={styles.loadingContainer}>
            <TeaLoading />
            <h3>Carregando...</h3>
          </div>
        </main>
      </>
    );
  }

  const totalWordsCount = post.data.content.reduce((wordCount, content) => {
    const headingWords = content.heading.split(/\s/).filter(Boolean).length;
    const bodyWords = RichText.asText(content.body)
      .split(/\s/)
      .filter(Boolean).length;

    const totalWords = headingWords + bodyWords;

    return wordCount + totalWords;
  }, 0);

  const readingTime = Math.ceil(
    totalWordsCount / AVERAGE_READING_WORDS_PER_MINUTE
  );

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling.</title>
      </Head>

      <img
        src={post.data.banner.url}
        alt={post.data.banner.alt}
        className={styles.banner}
      />

      <main className={styles.container}>
        <h1>{post.data.title}</h1>

        <div className={styles.postInfo}>
          <time>
            <FiCalendar size={20} />
            {post.first_publication_date}
          </time>
          <span>
            <FiUser size={20} />
            {post.data.author}
          </span>
          <span>
            <FiClock size={20} />
            {readingTime} min
          </span>
        </div>
        {post.latestEditionDate && (
          <p className={styles.editInfo}>
            * editado em {post.latestEditionDate}
          </p>
        )}

        <div className={styles.content}>
          {post.data.content.map(content => (
            <div key={content.heading} className={styles.contentBlock}>
              <h3>{content.heading}</h3>

              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
                className={styles.dynamicContent}
              />
            </div>
          ))}
        </div>

        <hr />

        <PostsNavigation
          className={styles.postsNavigationContainer}
          nextPost={nextPost}
          previousPost={previousPost}
        />

        <PostComments />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      orderings: '[document.first_publication_date desc]',
      pageSize: 5,
      lang: '*',
    }
  );

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {
    lang: 'pt-br',
  });

  const [nextPostResponse, previousPostResponse] = await Promise.all([
    prismic.query(
      [
        Prismic.predicates.at('document.type', 'posts'),
        Prismic.predicates.dateAfter(
          'document.first_publication_date',
          response.first_publication_date
        ),
      ],
      {
        fetch: ['posts.title'],
        orderings: '[document.first_publication_date]',
        pageSize: 1,
        lang: '*',
      }
    ),
    prismic.query(
      [
        Prismic.predicates.at('document.type', 'posts'),
        Prismic.predicates.dateBefore(
          'document.first_publication_date',
          response.first_publication_date
        ),
      ],
      {
        fetch: ['posts.title'],
        orderings: '[document.first_publication_date desc]',
        pageSize: 1,
        lang: '*',
      }
    ),
  ]);

  const nextPost =
    nextPostResponse.results.length > 0
      ? {
          slug: nextPostResponse.results[0].uid,
          title: nextPostResponse.results[0].data.title,
        }
      : null;
  const previousPost =
    previousPostResponse.results.length > 0
      ? {
          slug: previousPostResponse.results[0].uid,
          title: previousPostResponse.results[0].data.title,
        }
      : null;

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    latestEditionDate:
      response.first_publication_date !== response.last_publication_date
        ? format(
            new Date(response.last_publication_date),
            "dd MMM yyyy', às' HH:mm",
            { locale: ptBR }
          )
        : null,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
        alt: response.data.banner.alt,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
      nextPost,
      previousPost,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
