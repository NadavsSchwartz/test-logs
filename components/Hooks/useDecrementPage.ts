import { SetStateAction, useEffect } from 'react';

type Props = {
  // itemsType: 'classrooms' | 'users' | 'projects' | 'groups';
  page: number;
  total: number;
  setPage: (value: SetStateAction<number>) => void;
};

/**
 * reusable hook home, classrooms, users, projects, groups
 * decrement page if no posts on that page
 */
const useDecrementPage = ({ total, setPage, page }: Props) => {
  useEffect(() => {
    if (total > 0 && page > 1 && total - (page - 1)) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [total, page]);
};

export default useDecrementPage;
