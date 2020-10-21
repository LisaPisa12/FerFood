import styles from './DashFloat.module.css';

import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, place } from '../../types/redux';

import { setIfInsideRadius, voteNewOffer } from '../../redux/actions';

import calculateDistance from '../../helpers/calcDistance';

import { WatchedElement } from './element';

import { useMutation } from '@apollo/client';

import { voteOffer } from '../../Apollo/';

function DashFloat() {
  const dispatch = useDispatch();
  const places = useSelector((state: RootState) => state.places);
  const thisId = useSelector((state: RootState) => state.selectedId);
  const userCoords = useSelector((state: RootState) => state.userCoords);

  const [mutateOffer] = useMutation(voteOffer);

  const createGrid = () => {
    const root = document.documentElement;
    root.style.setProperty('--total', Math.floor(places.length).toString());
  };

  createGrid();

  const selectCorrectDiv = () => {
    if (window && document) document?.getElementById('focus')?.focus();
  };

  setTimeout(() => {
    selectCorrectDiv();
  }, 0);

  const calcDistance = () => {
    places.forEach((element) => {
      const newElement: place = {
        id: element.id,
        offers: element.offers,
        location: element.location,
      };

      const distance = calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        newElement.location?.coordinates[0],
        newElement.location?.coordinates[1]
      );

      newElement.isInsideRadius = distance ? distance < 0.36 : false;
      dispatch(setIfInsideRadius(newElement));
    });
  };

  const vote = async (vote: number, placeId: string, offerId: number) => {
    const thisOffer = {
      id: offerId,
      score: vote,
    };
    const place = await mutateOffer({
      variables: {
        id: placeId,
        offer: thisOffer,
      },
    });

    const newOffers = place?.offers?.map((offer, index) => {
      if (index === offerId) offer.voted = true;
      else offer.voted = false;
      return offer;
    });

    if (place) {
      const votedOffer = {
        id: placeId,
        offers: newOffers,
        vote: true,
      };

      dispatch(voteNewOffer(votedOffer));
    }
  };

  useEffect(() => {
    calcDistance();
  }, [places]);

  return (
    <div className={styles.float_container} data-testid="float_container">
      {places.map((element, index) => {
        return (
          <WatchedElement place={element} key={element.id} index={index}>
            <div
              className={styles.container}
              tabIndex={index === thisId ? 0 : 10}
              id={index === thisId ? 'focus' : ''}
            >
              <div className={styles.restaurant_data}>
                <h2>{element.name}</h2>
                {element.address ? <p>{element.address}</p> : ''}
                <p>
                  {calculateDistance(
                    userCoords.latitude,
                    userCoords.longitude,
                    element.location?.coordinates[0],
                    element.location?.coordinates[1]
                  )}{' '}
                  km far away
                </p>
                <p>{element.offers?.length} offers</p>
              </div>
              <div className={styles.restaurant_offers}>
                {element.offers?.map((offer, index) => (
                  <div
                    className={
                      element.isInsideRadius
                        ? styles.offers_data_with_vote
                        : styles.offers_data
                    }
                    key={offer.id}
                  >
                    <p
                      className={
                        element.isInsideRadius
                          ? styles.description_vote
                          : styles.description
                      }
                    >
                      {offer.description}
                    </p>
                    <p
                      className={
                        element.isInsideRadius
                          ? styles.offerType_vote
                          : styles.offerType
                      }
                    >
                      {offer.offerType}
                    </p>
                    <p className={styles.dates}>
                      Offers ends on {offer.end ? offer.end : ''}
                    </p>
                    {element.isInsideRadius && !offer.voted && (
                      <div className={styles.votes} id={index.toString()}>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const div = document.getElementById(
                              index.toString()
                            );
                            if (div) div.style.opacity = '0';
                          }}
                        >
                          Existe
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const div = document.getElementById(
                              index.toString()
                            );
                            if (div) div.style.opacity = '0';
                          }}
                        >
                          No Existe
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </WatchedElement>
        );
      })}
      <div className={styles.empty}></div>
    </div>
  );
}

export default DashFloat;
