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

const Home: React.FC = () => {

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

    const previousLogin = async () => {
        await Preferences.get({ key: 'token' }).then(e => tokenLogin(e));
    }
    const tokenLogin = async (e: any) => {
        if (e.value) {
            await tokenCheck({ token: e.value }).then(function (data: any) {
                if (!data) {
                    history.replace("/login")
                }
            })
        }
    }

    var notificationOpenedCallback = function (jsonData: any) {
        var redirect = jsonData.notification.additionalData.redirect;
        var id = jsonData.notification.additionalData.id;
        if(redirect){
            history.push(redirect);
        }
    };

    useIonViewWillEnter(() => {

        Network.getStatus().then(status => {

            if (!status.connected) {
                history.replace("/offline")
            } else {
                previousLogin();
                setSpinner(true);

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
                                        axios.post(api_url + 'devices' + api_key, user)
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



    return (

        <IonPage>

            <IonContent >
                <IonGrid>
                    <IonRow className="home-logo-row " >
                        <IonCol size="12"><div className="home-logo" ></div></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='12'>
                            <p className='home-text' style={{textAlign:"center", fontSize:"18px", lineHeight:"25px"}}>Here you can book a FREE Trishaw ride with one of our trained cyclists or a local delivery pick up, from associated shops and pharmacies. We are currently operating in Hayling Island and Hartney Whitney.</p>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size='12'>
                            <IonButton style={{width:"100%", textTransform:"initial"}} routerLink={"/bookings/create/ride"}>Book Trishaw Ride</IonButton>
                        </IonCol>
                        <IonCol size='12' style={{margin:"0x"}}>
                            <IonButton  style={{width:"100%", textTransform:"initial", marginTop:"0px"}} routerLink={"/bookings/create/delivery"}>Book Local Delivery</IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

            </IonContent>
        </IonPage >
    );
};

export default Home;