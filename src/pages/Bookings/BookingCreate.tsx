import React from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonList, IonButtons, IonButton
} from '@ionic/react';
import { AppBackButton } from '../../components/AppBackButton';

const BookingsCreate: React.FC = () => {


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
            <IonContent >
                <IonList style={{paddingLeft:"10px",paddingRight:"10px"}}>
                    <p  style={{ marginLeft: "10px" }}>Select a service</p>
                    <IonButton expand="block" color="primary" routerLink={'/bookings/create/delivery'} disabled={false} className="booking-create-button">Delivery Service</IonButton>
                    <IonButton expand="block" color="primary" routerLink={'/bookings/create/ride'} disabled={false} className="booking-create-button">Bike Ride</IonButton>
                </IonList>
            </IonContent>
         
        </IonPage >
    );
};

export default BookingsCreate;