import style from './style.module.scss';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { fiveStar_prop } from './type';
import { rate_status_type, rate_status_enum, star_prop, star_types, star_color_types } from './type';

const FiveStar = (fiveStar: fiveStar_prop) => {
    const rate: number | undefined = fiveStar.rate;

    if (rate === undefined) {
        throw new Error('Rate of FiveStar must is number !');
    }

    const check_number_range = (rate: number, first: number, last: number): rate_status_type => {
        if (rate > first && rate < last) {
            return rate_status_enum.EQUAL;
        } else {
            if (rate <= first) {
                return rate_status_enum.SMALLER;
            } else {
                return rate_status_enum.LARGER;
            }
        }
    };

    const c_0_05: rate_status_type = check_number_range(rate, 0, 0.5);
    // const c_05_1: rate_status_type = check_number_range(rate, 0.5, 1);
    const c_1_15: rate_status_type = check_number_range(rate, 1, 1.5);
    // const c_15_2: rate_status_type = check_number_range(rate, 1.5, 2);
    const c_2_25: rate_status_type = check_number_range(rate, 2, 2.5);
    // const c_25_3: rate_status_type = check_number_range(rate, 2.5, 3);
    const c_3_35: rate_status_type = check_number_range(rate, 3, 3.5);
    // const c_35_4: rate_status_type = check_number_range(rate, 3.5, 4);
    const c_4_45: rate_status_type = check_number_range(rate, 4, 4.5);
    // const c_45_5: rate_status_type = check_number_range(rate, 4.5, 5);

    const handle_star = (c_first_half: rate_status_type): star_prop => {
        if (c_first_half === rate_status_enum.SMALLER) {
            const star: star_prop = {
                color: star_color_types.EMPTY_STAR_COLOR,
                type: star_types.STAR,
            };
            return star;
        } else if (c_first_half === rate_status_enum.EQUAL) {
            const star: star_prop = {
                color: star_color_types.STAR_COLOR,
                type: star_types.HALF_STAR,
            };
            return star;
        } else {
            const star: star_prop = {
                color: star_color_types.STAR_COLOR,
                type: star_types.STAR,
            };
            return star;
        }
    };

    const one_star = (c_first_half: rate_status_type) => {
        const star = handle_star(c_first_half);
        if (star.type === star_types.STAR) {
            return <FaStar color={star.color} />;
        } else {
            return <FaStarHalf color={star.color} />;
        }
    };

    return (
        <div className={style.parent}>
            {one_star(c_0_05)}
            {one_star(c_1_15)}
            {one_star(c_2_25)}
            {one_star(c_3_35)}
            {one_star(c_4_45)}
        </div>
    );
};

export default FiveStar;
