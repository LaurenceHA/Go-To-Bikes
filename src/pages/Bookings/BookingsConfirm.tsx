import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonRow, IonCol, IonSpinner, useIonViewWillEnter, IonGrid, IonButtons, IonBadge
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import moment from 'moment';
import { RouteComponentProps } from 'react-router';
import { AppBackButton } from '../../components/AppBackButton';

interface BookingProps extends RouteComponentProps<{
    booking: string
}> { }

const BookingsConfirm: React.FC<BookingProps> = ({ match }) => {

    const history = useHistory();
    const [spinner, setSpinner] = useState<boolean>(true);
    const [showToast, setShowToast] = useState<boolean>(false);
    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [items, setItems] = useState<any>([]);
    const [booking, setBooking] = useState<any>([]);
    const [location, setLocation] = useState<any>([]);
    const [errors, setErrors] = useState<[]>([]);

    function fetchData() {
        setSpinner(true);
        axios.get(api_url + 'bookings/' + match.params.booking + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                setBooking(res.data.booking);
                setItems(res.data.items);
                setLocation(res.data.location)
                setSpinner(false);
            }).catch((error: any) => {
                setSpinner(false);
                setShowToast(true);
            });
    }

    useIonViewWillEnter(() => {

        fetchData();

    });

    return (

        <IonPage>

            <IonHeader>

                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton forceLink='/bookings'/>
                    </IonButtons>
                    <IonTitle>View Booking</IonTitle>
                </IonToolbar>
            </IonHeader>

            {spinner ?
                <IonContent >
                    <div className="spinner-wrapper spinner-wrapper-requests">
                        <IonSpinner name="crescent" />
                    </div>
                </IonContent>

                :
                <IonContent >
                    {!booking ?
                        <IonRow>
                            <IonCol size="12" className="text-center text-help" >The booking could not be found, please try again.</IonCol>
                        </IonRow>
                        :
                        <IonGrid className="diary-view-grid">
                            <IonRow>
                                <IonCol size="12">
                                    <div className='confirmation-banner'>
                                        <span>Thank you for your booking.</span>
                                        <span>The details of your booking are below.</span>
                                    </div>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <h1 style={{marginTop:"5px"}}>
                                        {moment(booking.date).format("dddd DD MMMM YYYY")}
                                        {booking.time_from &&
                                            <span >
                                                <br></br>{moment(booking.time_from, "HH:mm:ss").format("HH:mm")}
                                                {booking.time_to &&
                                                    <span> - {moment(booking.time_to, "HH:mm:ss").format("HH:mm")}</span>
                                                }
                                            </span>
                                        }
                                    </h1>

                                </IonCol>
                            </IonRow>
                            {location && location.name &&
                                <IonRow>

                                    <IonCol size="12">
                                        <IonBadge color="secondary" className="title-badge">{location.name} {booking.type === "delivery" ? <span> - Delivery Service</span> : <span> - Bike Ride</span>}</IonBadge>
                                    </IonCol>

                                </IonRow>
                            }

                            {authValues.user.type === "shop" &&
                                <IonRow>
                                    <IonCol size="12">
                                        {(!booking.customer_confirmed_at && booking.created_type === "shop") ?
                                            <IonBadge color="medium" className="title-badge">{booking.customer_first_name + " " + booking.customer_last_name} - Pending</IonBadge>
                                            :
                                            <IonBadge color="success" className="title-badge">{booking.customer_first_name + " " + booking.customer_last_name}</IonBadge>
                                        }
                                    </IonCol>
                                </IonRow>
                            }
                            {(booking.type == "ride" && location.description) &&
                                <IonRow>

                                    <IonCol size="12" className='ws-pl'>
                                        <b>Location Description:</b><br></br>{location.description}
                                    </IonCol>

                                </IonRow>
                            }
                            {booking.customer_notes &&
                                <IonRow>

                                    <IonCol size="12">
                                        <p className=" ws-pl" >{booking.customer_notes}</p>
                                    </IonCol>

                                </IonRow>
                            }
                            <IonRow>
                                <IonCol size="12">
                                    <p className=" ws-pl" ><b>Pick up Location / Description</b><br></br>{booking.pickup}</p>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <p className=" ws-pl" ><b>Drop-off Location</b><br></br>{booking.dropoff}</p>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    }
                    <section className="full-width">
                        {errors.map((error, key) => (
                            <div className="form-error" key={"error-" + key}>{error}</div>
                        ))}
                    </section>
                </IonContent>
            }
        </IonPage >
    );
};

export default BookingsConfirm;