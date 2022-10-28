import React, { useState, useContext, useEffect } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonRow, IonCol, IonSpinner, useIonViewWillEnter,
    IonGrid, IonButtons, IonButton, IonIcon, IonDatetime, IonDatetimeButton, IonTextarea, IonSelect, IonSelectOption, IonModal
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import { Preferences } from '@capacitor/preferences';
import { RouteComponentProps } from 'react-router';
import { AppBackButton } from '../../components/AppBackButton';

interface BookingProps extends RouteComponentProps<{
    type: string
}> { }

const BookingsCreate2: React.FC<BookingProps> = ({ match }) => {

    const history = useHistory();
    const [spinner, setSpinner] = useState<boolean>(true);
    const [locations, setLocations] = useState<any>([]);

    const [showToast, setShowToast] = useState<boolean>(false);
    const { api_url, api_key, authValues } = useContext(AuthContext);

    function fetchData() {

        setSpinner(true);
        axios.get(api_url + 'bookings/create' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                setLocations(res.data.locations);
                setSpinner(false);
            }).catch((error: any) => {
                setSpinner(false);
                setShowToast(true);
            });
    }

    useIonViewWillEnter(() => {

        fetchData();

    });

    const selectLocation = async (location: any) => {
        await Preferences.set({
            key: 'location_id',
            value: location+""
        }).then(function () {
            history.push({
                pathname: '/bookings/create/' + match.params.type + '/date'
            });
        });
    }

    return (

        <IonPage>
            <IonHeader>

                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton />
                    </IonButtons>
                    <IonTitle>Create Booking</IonTitle>
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
                    <IonList style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                        <p className='text-muted' style={{ marginLeft: "10px" }}>Select a location</p>
                        {Object.keys(locations).map((key) => (
                            <IonButton expand="block" color="primary" disabled={false} className="booking-create-button" key={"loc-" + locations[key].id} onClick={e => selectLocation(locations[key].id)}>{locations[key].name}</IonButton>
                        ))}

                    </IonList>
                </IonContent>
            }
        </IonPage >
    );
};

export default BookingsCreate2;