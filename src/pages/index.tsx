// eslint-disable-next-line import/no-extraneous-dependencies
import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { withQuery } from 'ufo';

import { getPrismicClient } from '../services/prismic';

import Post from '../components/Post';
import PostShimmer from '../components/PostShimmer';

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

const parsePost = (post: Post): Post => ({
  uid: post.uid,
  first_publication_date: format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    { locale: ptBR }
  ),
  data: {
    title: post.data.title,
    subtitle: post.data.subtitle,
    author: post.data.author,
  },
});

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

  async function handlePagination(): Promise<void> {
    if (!nextPage) {
      return;
    }

    try {
      setIsFetchingPosts(true);

      const response = await fetch(withQuery(nextPage, { lang: '*' }));
      const newPosts = await response.json();

      const parsedPosts = newPosts.results.map(parsePost);

      setPosts(state => state.concat(parsedPosts));
      setNextPage(newPosts.next_page);
    } finally {
      setIsFetchingPosts(false);
    }
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling.</title>
      </Head>

      <main className={styles.container}>
        {posts.map(post => (
          <Post key={post.uid} post={post} />
        ))}

        {isFetchingPosts && <PostShimmer quantity={3} />}

        {nextPage && !isFetchingPosts && (
          <button type="button" onClick={handlePagination}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      orderings: '[document.first_publication_date desc]',
      pageSize: 5,
      lang: '*',
    }
  );

  const parsedPosts = postsResponse.results.map(parsePost);

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: parsedPosts,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
