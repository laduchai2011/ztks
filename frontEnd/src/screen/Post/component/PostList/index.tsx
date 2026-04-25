import { memo, useState } from 'react';
import style from './style.module.scss';

import { SEE_MORE } from '@src/const/text';

const PostList = () => {
    const [hasMore, setHasMore] = useState<boolean>(false);

    const handleSeeMore = () => {};

    return (
        <div className={style.parent}>
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(PostList);
