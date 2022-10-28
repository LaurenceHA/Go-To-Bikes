import React, { useState, useContext, useRef } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonRow, IonCol, IonSpinner, useIonViewWillEnter, isPlatform, IonNote,
    IonGrid, IonButtons, IonButton, IonIcon
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { useHistory } from "react-router";
import moment from 'moment';
import OneSignal from 'onesignal-cordova-plugin';
import { addOutline, personOutline } from 'ionicons/icons';

declare let window: any;

const Bookings: React.FC = () => {

    const history = useHistory();
    const [spinner, setSpinner] = useState<boolean>(true);
    const [bookings, setBookings] = useState<any>([]);
    const [status, setStatus] = useState<string>("1");
    const [title, setTitle] = useState<string>("Pending");
    const [showToast, setShowToast] = useState<boolean>(false);
    const { api_url, api_key, authValues, tokenCheck } = useContext(AuthContext);

    let filters = useRef<{ sTitle: any }>({
        sTitle: "Pending",
    });

    function fetchData(title: string) {

        axios.get(api_url + 'bookings' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type + "&status=" + title)
            .then((res: any) => {
                setSpinner(false);
                setBookings(res.data);
            }).catch((error: any) => {
                setSpinner(false);
                setBookings([]);
                setShowToast(true);
            });

    }

    const previousLogin = async () => {
        await Preferences.get({ key: 'token' }).then(e => tokenLogin(e));
    }
    const tokenLogin = async (e: any) => {
        if (e.value) {
            await tokenCheck({ token: e.value }).then(function (data: any) {
                if (data !== true) {
                    history.replace("/login")
                }
            })
        }
    }

    var notificationOpenedCallback = function (jsonData: any) {

    };

    useIonViewWillEnter(() => {

        Network.getStatus().then(status => {

            if (!status.connected) {
                history.replace("/offline")
            } else {
                previousLogin();
                setSpinner(true);
                fetchData(filters.current.sTitle);

                setTimeout(function () {
                    
                    if ((isPlatform('ios') || isPlatform('android')) && window['plugins']) {

                        if (OneSignal) {
                            OneSignal.setAppId("477d3ddd-ae3f-4ecd-b5c7-858fcdef2f55");

                            OneSignal.setNotificationOpenedHandler(notificationOpenedCallback);

                            OneSignal.promptForPushNotificationsWithUserResponse(function (state: any) {

                            });
                            OneSignal.addSubscriptionObserver(function (state: any) {
                                //console.log("onesignaltest4");
                                //console.log(JSON.stringify(state));
                                if (!state.from.isSubscribed && state.to.isSubscribed) {
                                    //console.log("onesignaltest" + state.to.userId)
                                    if (state.to.userId) {
                                        Preferences.set({
                                            key: 'device_id',
                                            value: state.to.userId
                                        });
                                        const user = {
                                            resource_id: authValues.user.id,
                                            resource_type: authValues.user.type,
                                            device: state.to.userId,
                                        };
                                        axios.post(api_url + 'devices' + api_key , user)
                                            .then((res: any) => {
                                                //console.log("onesignaltestsuccess")
                                            }).catch((error: any) => {
                                                //console.log("onesignaltestfailure")
                                            });
                                    }
                                }
                            });

                        }
                    }

                }, 100);
            }
        });


    });

    function bookingClick(booking: any) {
        history.push({
            pathname: '/bookings/' + booking.id,
            state: booking
        });

    }

    function statusSwitch(type: string, title: string) {

        setStatus(type);
        setTitle(title);
        setSpinner(true);
        filters.current = { sTitle: title };
        fetchData(title);

    }

    return (

        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonButton routerLink={'/settings'}>
                            <IonIcon icon={personOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Bookings</IonTitle>
                    {(authValues.user.type === "customer") &&
                        <IonButtons slot="end">
                            <IonButton routerLink={'/bookings/create'}>
                                <IonIcon icon={addOutline} />
                            </IonButton>
                        </IonButtons>
                    }
                    {(authValues.user.type === "shop") &&
                        <IonButtons slot="end">
                            <IonButton routerLink={'/bookings/create/delivery'}>
                                <IonIcon icon={addOutline} />
                            </IonButton>
                        </IonButtons>
                    }

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
                    <IonGrid className="requests-col-buttons">
                        <IonRow class="requests-buttons-row">
                            <IonCol size="6">
                                {status === "1" ?
                                    <IonItem className="selected-request-button" color="light" lines="none" onClick={e => statusSwitch("1", "Pending")}>
                                        <IonLabel>Pending</IonLabel>
                                    </IonItem>
                                    :
                                    <IonItem color="light" lines="none" onClick={e => statusSwitch("1", "Pending")}>
                                        <IonLabel>Pending</IonLabel>
                                    </IonItem>
                                }
                            </IonCol>
                            <IonCol size="6">
                                {status === "5" ?
                                    <IonItem className="selected-request-button" color="light" lines="none" onClick={e => statusSwitch("5", "Upcoming")}>
                                        <IonLabel>Upcoming</IonLabel>
                                    </IonItem>
                                    :
                                    <IonItem color="light" lines="none" onClick={e => statusSwitch("5", "Upcoming")}>
                                        <IonLabel>Upcoming</IonLabel>
                                    </IonItem>
                                }
                            </IonCol>
                            <IonCol size="6">
                                {status === "4" ?
                                    <IonItem className="selected-request-button" color="light" lines="none" onClick={e => statusSwitch("4", "Past")}>
                                        <IonLabel>Past</IonLabel>
                                    </IonItem>
                                    :
                                    <IonItem color="light" lines="none" onClick={e => statusSwitch("4", "Past")}>
                                        <IonLabel>Past</IonLabel>
                                    </IonItem>
                                }
                            </IonCol>
                            <IonCol size="6">
                                {status === "3" ?
                                    <IonItem className="selected-request-button" color="light" lines="none" onClick={e => statusSwitch("3", "Declined")}>
                                        <IonLabel>Declined</IonLabel>
                                    </IonItem>
                                    :
                                    <IonItem color="light" lines="none" onClick={e => statusSwitch("3", "Declined")}>
                                        <IonLabel>Declined</IonLabel>
                                    </IonItem>
                                }
                            </IonCol>
                            <IonCol size="6">
                                {status === "2" ?
                                    <IonItem className="selected-request-button" color="light" lines="none" onClick={e => statusSwitch("2", "Cancelled")}>
                                        <IonLabel>Cancelled</IonLabel>
                                    </IonItem>
                                    :
                                    <IonItem color="light" lines="none" onClick={e => statusSwitch("2", "Cancelled")}>
                                        <IonLabel>Cancelled</IonLabel>
                                    </IonItem>
                                }
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <h1 className="request-title">{title}</h1>

                    {bookings.length === 0 ?
                        <IonRow>
                            <IonCol size="12" className="text-center text-help" >No bookings found.</IonCol>
                        </IonRow>
                        :
                        <IonList >
                            {bookings.map((booking: any) => (


                                <IonItem onClick={e => bookingClick(booking)} key={booking.id}>
                                    <IonLabel>
                                        <h2>{moment(booking.date).format("DD/MM/YYYY")}</h2>
                                        {(booking.location_name) &&
                                            < p >{booking.location_name}</p>
                                        }
                                        {(authValues.user.type !== "shop" && booking.shop_name && booking.type === "delivery") &&
                                            < p >{booking.shop_name}</p>
                                        }
                                        
                                        {(authValues.user.type !== "volunteer" && booking.volunteer_first_name) &&
                                            < p >{booking.volunteer_first_name} {booking.volunteer_last_name}</p>
                                        }
                                        {(authValues.user.type !== "customer" && booking.customer_first_name) &&
                                            < p >{booking.customer_first_name} {booking.customer_last_name}</p>
                                        }
                                    </IonLabel>
                                    {(booking.total && booking.type === "delivery") &&
                                        <IonNote slot="end" color="medium">£{booking.total}</IonNote>
                                    }

                                </IonItem>


                            ))}
                        </IonList>
                    }

                </IonContent>
            }
        </IonPage >
    );
};

export default Bookings;