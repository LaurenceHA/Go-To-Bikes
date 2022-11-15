import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonRow, IonCol, IonSpinner, useIonViewWillEnter, IonGrid, IonButtons, IonBadge, IonItem, IonNote, IonLabel, IonFooter, IonButton, IonAlert,
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

const BookingsShow: React.FC<BookingProps> = ({ match }) => {

    const history = useHistory();
    const [spinner, setSpinner] = useState<boolean>(true);
    const [showToast, setShowToast] = useState<boolean>(false);
    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [items, setItems] = useState<any>([]);
    const [booking, setBooking] = useState<any>([]);
    const [location, setLocation] = useState<any>([]);
    const [cancelWarning, setCancelWarning] = useState(false);
    const [acceptWarning, setAcceptWarning] = useState(false);
    const [declineWarning, setDeclineWarning] = useState(false);
    const [customerAcceptWarning, setCustomerAcceptWarning] = useState(false);
    const [customerDeclineWarning, setCustomerDeclineWarning] = useState(false);
    const [volunteerAcceptWarning, setVolunteerAcceptWarning] = useState(false);
    const [volunteerCompleteWarning, setVolunteerCompleteWarning] = useState(false);
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

    function cancelBooking() {
        axios.patch(api_url + 'bookings/' + match.params.booking + '/cancel' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                history.goBack();
            }).catch((error: any) => {
                if (error.response && error.response.status === 422 && error.response.request.response) {
                    const response_errors = Object.values(JSON.parse(error.response.request.response)) as [];
                    setErrors(response_errors);
                } else {
                    setShowToast(true);
                }
            });
    }

    function acceptBooking() {
        axios.patch(api_url + 'bookings/' + match.params.booking + '/shop_accept' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                history.goBack();
            }).catch((error: any) => {
                if (error.response && error.response.status === 422 && error.response.request.response) {
                    const response_errors = Object.values(JSON.parse(error.response.request.response)) as [];
                    setErrors(response_errors);
                } else {
                    setShowToast(true);
                }
            });
    }

    function declineBooking() {
        axios.patch(api_url + 'bookings/' + match.params.booking + '/shop_decline' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                history.goBack();
            }).catch((error: any) => {
                if (error.response && error.response.status === 422 && error.response.request.response) {
                    const response_errors = Object.values(JSON.parse(error.response.request.response)) as [];
                    setErrors(response_errors);
                } else {
                    setShowToast(true);
                }
            });
    }

    function customerAcceptBooking() {
        axios.patch(api_url + 'bookings/' + match.params.booking + '/customer_accept' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                history.goBack();
            }).catch((error: any) => {
                if (error.response && error.response.status === 422 && error.response.request.response) {
                    const response_errors = Object.values(JSON.parse(error.response.request.response)) as [];
                    setErrors(response_errors);
                } else {
                    setShowToast(true);
                }
            });
    }

    function customerDeclineBooking() {
        axios.patch(api_url + 'bookings/' + match.params.booking + '/customer_decline' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                history.goBack();
            }).catch((error: any) => {
                if (error.response && error.response.status === 422 && error.response.request.response) {
                    const response_errors = Object.values(JSON.parse(error.response.request.response)) as [];
                    setErrors(response_errors);
                } else {
                    setShowToast(true);
                }
            });
    }

    function volunteerAcceptBooking() {
        axios.patch(api_url + 'bookings/' + match.params.booking + '/volunteer_accept' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                history.goBack();
            }).catch((error: any) => {
                if (error.response && error.response.status === 422 && error.response.request.response) {
                    const response_errors = Object.values(JSON.parse(error.response.request.response)) as [];
                    setErrors(response_errors);
                } else {
                    setShowToast(true);
                }
            });


    }

    function volunteerCompleteBooking() {
        axios.patch(api_url + 'bookings/' + match.params.booking + '/volunteer_complete' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                history.goBack();
            }).catch((error: any) => {
                if (error.response && error.response.status === 422 && error.response.request.response) {
                    const response_errors = Object.values(JSON.parse(error.response.request.response)) as [];
                    setErrors(response_errors);
                } else {
                    setShowToast(true);
                }
            });
    }


    return (

        <IonPage>
            <IonAlert
                isOpen={cancelWarning}
                onDidDismiss={() => setCancelWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to cancel this booking? This action cannot be undone.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            cancelBooking()
                        }
                    }
                ]}
            />
            <IonAlert
                isOpen={declineWarning}
                onDidDismiss={() => setDeclineWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to decline this booking? This action cannot be undone.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            declineBooking()
                        }
                    }
                ]}
            />
            <IonAlert
                isOpen={acceptWarning}
                onDidDismiss={() => setAcceptWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to accept this booking? The booking will be available for Volunteers to perform.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            acceptBooking()
                        }
                    }
                ]}
            />
            <IonAlert
                isOpen={customerDeclineWarning}
                onDidDismiss={() => setCustomerDeclineWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to decline this booking? This action cannot be undone.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            customerDeclineBooking()
                        }
                    }
                ]}
            />
            <IonAlert
                isOpen={customerAcceptWarning}
                onDidDismiss={() => setCustomerAcceptWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to accept this booking? The booking will be available for Volunteers to perform.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            customerAcceptBooking()
                        }
                    }
                ]}
            />
            <IonAlert
                isOpen={volunteerAcceptWarning}
                onDidDismiss={() => setVolunteerAcceptWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to accept this booking? The customer will be notified and no other volunteers will be able to apply.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            volunteerAcceptBooking()
                        }
                    }
                ]}
            />
            <IonAlert
                isOpen={volunteerCompleteWarning}
                onDidDismiss={() => setVolunteerCompleteWarning(false)}
                cssClass='my-custom-class'
                header={'Are you sure you want to complete this booking? The customer will be notified and will be able to review their experience.'}
                buttons={[
                    {
                        text: 'Back',
                        role: 'cancel',
                        cssClass: 'secondary'
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            volunteerCompleteBooking()
                        }
                    }
                ]}
            />
            <IonHeader>

                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton forceLink='/bookings'/>
                    </IonButtons>
                    <IonTitle>View Booking</IonTitle>
                </IonToolbar>
                {booking.status === "cancelled" &&
                    <IonToolbar color="warning">
                        <IonTitle className="toolbar-second-info text-center" >
                            Cancelled  {booking.status_updated_at && <b>{moment(booking.status_updated_at).format("DD/MM/YYYY")}</b>}
                        </IonTitle>
                    </IonToolbar>
                }
                {booking.status === "declined" &&
                    <IonToolbar color="warning">
                        {booking.status_updated_by_type === "shop" &&
                            <IonTitle className="toolbar-second-info text-center" >
                                Shop declined on <b>{moment(booking.status_updated_at).format("DD/MM/YYYY")}</b>
                            </IonTitle>
                        }
                        {booking.status_updated_by_type === "customer" &&
                            <IonTitle className="toolbar-second-info text-center" >
                                Customer declined on <b>{moment(booking.status_updated_at).format("DD/MM/YYYY")}</b>
                            </IonTitle>
                        }
                    </IonToolbar>
                }
                {booking.status === "completed" &&
                    <IonToolbar color="success">
                        <IonTitle className="toolbar-second-info text-center" >
                            Completed on {booking.status_updated_at && <b>{moment(booking.status_updated_at).format("DD/MM/YYYY")}</b>}
                        </IonTitle>
                    </IonToolbar>
                }
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
                            <IonRow>
                                <IonCol size="12">
                                    {!booking.volunteer_confirmed_at ?
                                        <IonBadge color="medium" className="title-badge">Awaiting Volunteer</IonBadge>
                                        :
                                        <IonBadge color="success" className="title-badge">{booking.volunteer_first_name + " " + booking.volunteer_last_name}</IonBadge>
                                    }
                                </IonCol>
                            </IonRow>
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

                            { /*(booking.type == "delivery" && items.length > 0) &&
                                <IonRow>
                                    <IonCol size="12">
                                        <h3>Products</h3>
                                        {Object.keys(items).map((key) => (
                                            <IonItem className="ion-no-padding item-">
                                                <IonRow>
                                                    <IonCol size='12' style={{ "padding": "5px 0px 5px 0px" }}>
                                                        {items[key].name}
                                                        <br></br>Price: {items[key].price && <span> £{parseFloat(items[key].price).toFixed(2)}</span>}
                                                        <br></br>Quantity: {items[key].quantity}
                                                    </IonCol>
                                                </IonRow>
                                                {(items[key].total && booking.type === "delivery") &&
                                                    <IonNote slot="end" >£{items[key].total}</IonNote>
                                                }
                                            </IonItem>

                                        ))}
                                        <IonItem className='product-list-item'>
                                            <IonLabel style={{ textAlign: "right" }}>Total: £{booking.total}</IonLabel>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                                            */}
                        </IonGrid>
                    }
                    <section className="full-width">
                        {errors.map((error, key) => (
                            <div className="form-error" key={"error-" + key}>{error}</div>
                        ))}
                    </section>
                </IonContent>
            }
            {(booking.status == "active" && !booking.volunteer_confirmed_at && ((authValues.user.type === "shop" && booking.created_type === "shop") || (authValues.user.type === "shop" && booking.shop_confirmed_at) || (authValues.user.type === "customer" && booking.created_type === "customer") || (authValues.user.type === "customer" && booking.customer_confirmed_at))) &&
                <IonFooter className="ion-no-border">
                    <IonButton expand="block" mode='ios' color="warning" className="floating-button" onClick={e => { setCancelWarning(true) }}>Cancel</IonButton>
                </IonFooter>
            }
            {(booking.status == "active" && authValues.user.type === "volunteer" && booking.volunteer_confirmed_at) &&
                <IonFooter className="ion-no-border">
                    <IonButton expand="block" mode='ios' color="success" className="floating-button" onClick={e => { setVolunteerCompleteWarning(true) }}>Mark Complete</IonButton>
                    <IonButton expand="block" mode='ios' color="warning" className="floating-button" onClick={e => { setCancelWarning(true) }}>Cancel</IonButton>
                </IonFooter>
            }
            {(booking.status == "active" && authValues.user.type === "shop" && booking.created_type === "customer" && !booking.shop_confirmed_at) &&
                <IonFooter className="ion-no-border">
                    <IonButton expand="block" mode='ios' color="success" className="floating-button" onClick={e => { setAcceptWarning(true) }}>Accept</IonButton>
                    <IonButton expand="block" mode='ios' color="danger" className="floating-button" onClick={e => { setDeclineWarning(true) }}>Decline</IonButton>
                </IonFooter>
            }
            {(booking.status == "active" && authValues.user.type === "customer" && booking.created_type === "shop" && !booking.customer_confirmed_at) &&
                <IonFooter className="ion-no-border">
                    <IonButton expand="block" mode='ios' color="success" className="floating-button" onClick={e => { setCustomerAcceptWarning(true) }}>Accept</IonButton>
                    <IonButton expand="block" mode='ios' color="danger" className="floating-button" onClick={e => { setCustomerDeclineWarning(true) }}>Decline</IonButton>
                </IonFooter>
            }
            {(booking.status == "active" && authValues.user.type === "volunteer" && !booking.volunteer_confirmed_at) &&
                <IonFooter className="ion-no-border">
                    <IonButton expand="block" mode='ios' color="success" className="floating-button" onClick={e => { setVolunteerAcceptWarning(true) }}>Accept</IonButton>
                </IonFooter>
            }
            {(booking.status == "completed" && authValues.user.type === "customer" && !booking.review) &&
                <IonFooter className="ion-no-border">
                    <IonButton expand="block" mode='ios' color="success" className="floating-button" routerLink={'/bookings/' + booking.id + "/review"}>Leave Feedback</IonButton>
                </IonFooter>
            }
        </IonPage >
    );
};

export default BookingsShow;