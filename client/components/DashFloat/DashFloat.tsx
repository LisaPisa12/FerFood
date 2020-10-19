import styles from './DashFloat.module.css';

import { useSelector } from 'react-redux';
import { RootState } from '../../types/redux';

function DashFloat() {
  const places = useSelector((state: RootState) => state.places);
  const thisId = useSelector((state: RootState) => state.selectedId);
  let place;

  if (places && thisId) {
    place = places.find((el) => el.id === thisId);
  }

  return (
    <div className={styles.float_container} data-testid="float_container">
      <div className={styles.float_info}>
        <img src="floatTest.jpg" alt="" className={styles.float_img} />
        <div className={styles.float_text}>
          <div className={styles.float_offer}>
            {place?.offers.map((el, key) => (
              <div key={key} className={styles.offer}>
                <h3>
                  <img
                    src="testOfferIcon.svg"
                    alt=""
                    className={styles.offer_icon}
                  />{' '}
                  {el.description}
                </h3>
              </div>
            ))}
          </div>
          <h5>{place?.name}</h5>
        </div>
      </div>
    </div>
  );
}

export default DashFloat;
