import style from './style.module.scss';

const OverView = () => {
    return (
        <div className={style.parent}>
            <div className={style.temId}>id</div>
            <img
                className={style.image}
                src="http://zalo5k.local.com:4000/api/service_image_v1/query/image/1774939478593_1_134100726953368780.jpg"
                alt=""
            />
            <div className={style.fieldsContainer}>
                <div>Những trường dữ liệu</div>
                <div>
                    <div>sdfsdf</div>
                    <div>sdfsdf</div>
                    <div>sdfsdf</div>
                    <div>sdfsdf</div>
                </div>
            </div>
            <div className={style.cost}>
                <div>
                    <div>Số điện thoại</div>
                    <div>500 VND</div>
                </div>
                <div>
                    <div>UID</div>
                    <div>350 VND</div>
                </div>
            </div>
        </div>
    );
};

export default OverView;
