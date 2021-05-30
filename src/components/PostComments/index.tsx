import { useEffect } from 'react';

const UTTERANCES_CONTAINER_ID = 'utterances-container';

export default function PostComments(): JSX.Element {
  useEffect(() => {
    const utterancesContainer = document.getElementById(
      UTTERANCES_CONTAINER_ID
    );

    const utterancesScript = document.createElement('script');
    utterancesScript.src = 'https://utteranc.es/client.js';
    utterancesScript.async = true;
    utterancesScript.setAttribute('repo', process.env.NEXT_PUBLIC_REPO_NAME);
    utterancesScript.setAttribute('issue-term', 'pathname');
    utterancesScript.setAttribute('label', ':speech_balloon: post comment');
    utterancesScript.setAttribute('theme', 'photon-dark');
    utterancesScript.setAttribute('crossorigin', 'anonymous');

    utterancesContainer.appendChild(utterancesScript);
  }, []);

  return <div id={UTTERANCES_CONTAINER_ID} />;
}
