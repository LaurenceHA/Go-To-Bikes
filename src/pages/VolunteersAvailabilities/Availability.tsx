import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonButtons, IonButton,
    IonInput, useIonViewWillEnter, IonToast, IonIcon, IonAlert, IonSpinner, IonNote, IonRow, IonCol
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import { addOutline, cameraOutline } from 'ionicons/icons';
import moment from 'moment';
import { AppBackButton } from '../../components/AppBackButton';

const Availability: React.FC = () => {

    const history = useHistory();
    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [spinner, setSpinner] = useState<boolean>(true);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [errors, setErrors] = useState<[]>([]);
    const [success, setSuccess] = useState<string>("");
    const [availability, setAvailability] = useState<any>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    useIonViewWillEnter(() => {
        fetchData();
    });

    function fetchData() {
        axios.get(api_url + 'volunteers/' + authValues.user.id + '/availability' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type + "&status[]=1&status[]=2")
            .then((res: any) => {
                setAvailability(res.data);
                setSpinner(false);
            }).catch((error: any) => {
                setSpinner(false);
                setShowToast(true);
            });
    }

    function availabilityClick(item: any) {
        history.push({
            pathname: '/availability/' + item.id,
            state: item
        });

    }

    return (

        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Availability</IonTitle>
                    <IonButtons slot="end">
                        <IonButton routerLink={'/availability/create'}>
                            <IonIcon icon={addOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent >
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="An error occurred, please try again or contact support if the issue persists."
                    position="top"
                    buttons={[{
                        text: 'Close',
                        role: 'cancel'
                    }]}
                />
                <IonList>
                    {availability.length === 0 &&
                        <IonRow>
                            <IonCol size="12" className="text-center text-help" >No availability found.</IonCol>
                        </IonRow>
                    }
                    {Object.keys(availability).map((key) => (
                        <IonItem className='product-list-item' key={"item" + availability[key].id} onClick={e => availabilityClick(availability[key])}>
                            <IonLabel>
                                <h2>{moment(availability[key].date).format("DD/MM/YYYY")}</h2>
                                <p>{moment(availability[key].time_from, "HH:mm:ss").format("HH:mm")} - {moment(availability[key].time_to, "HH:mm:ss").format("HH:mm")}</p>
                                <p className='ws-pl'>{availability[key].description}</p>
                            </IonLabel>
                            {availability[key].price &&
                                <IonNote slot="end" color="medium">£{parseFloat(availability[key].price).toFixed(2)}</IonNote>
                            }
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );

};

export default Availability;