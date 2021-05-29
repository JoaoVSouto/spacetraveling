import styles from './paginationButton.module.scss';

type PaginationButtonProps = {
  onClick?: () => void | Promise<void>;
};

export default function PaginationButton({
  onClick,
}: PaginationButtonProps): JSX.Element {
  return (
    <button type="button" className={styles.container} onClick={onClick}>
      Carregar mais posts
    </button>
  );
}
