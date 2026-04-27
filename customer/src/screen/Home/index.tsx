import style from './style.module.scss';
import Header from '../Header';
import { select_enum } from '@src/router/type';
import Filter from './component/Filter';
import PostList from './component/PostList';

const Home = () => {
    return (
        <div className={style.parent}>
            <div className={style.main}>
                <Header selected={select_enum.HOME} />
                <Filter />
                <PostList />
            </div>
        </div>
    );
};

export default Home;
