import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonButtons, IonButton,
    IonInput, useIonViewWillEnter, IonToast, IonIcon, IonAlert, IonSpinner, IonNote, IonTextarea, IonSelect, IonSelectOption
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { useHistory } from "react-router";
import { AppBackButton } from '../../components/AppBackButton';

const ItemsCreate: React.FC = () => {

    const history = useHistory();
    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [status, setStatus] = useState<string>("1");
    const [errors, setErrors] = useState<[]>([]);
    const [success, setSuccess] = useState<string>("");
    const [items, setItems] = useState<any>([]);
    const [uploading, setUploading] = useState<boolean>(false);

    useIonViewWillEnter(() => {

    });

    function storeItem() {

        setUploading(true);

        const data = {
            name: name,
            description: description,
            price: price,
            status: status,
            resource_id: authValues.user.id,
            resource_type: authValues.user.type
        };
        axios.post(api_url + 'shops/' + authValues.user.id + '/items' + api_key, data)
            .then((res: any) => {
                setUploading(false);
                history.goBack();
            }).catch((error: any) => {
                setUploading(false);
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
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <AppBackButton />
                    </IonButtons>
                    <IonTitle>Add Product</IonTitle>
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
                    <IonItem>
                        <IonLabel position="stacked">Name: </IonLabel>
                        <IonInput onIonChange={e => setName(e.detail.value as string)} value={name} autocapitalize="sentences"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Description: </IonLabel>
                        <IonTextarea onIonChange={e => setDescription(e.detail.value as string)} value={description} autocapitalize="sentences"></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="bold" position="stacked">Amount (£): </IonLabel>
                        <IonInput type="tel" inputmode="decimal" step="0.01" onIonChange={e => setPrice(e.detail.value as any)} value={price}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="bold" position="stacked">Status: </IonLabel>
                        <IonSelect interfaceOptions={{ cssClass: 'select-wide' }} onIonChange={e => setStatus(e.detail.value)} value={status}>
                            <IonSelectOption key={"status-1"} value="1">Visible</IonSelectOption>
                            <IonSelectOption key={"status-2"} value="2">Hidden</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <section className="full-width">
                        {uploading ?
                            <IonButton expand="block" color="primary" disabled={true}><IonSpinner name="crescent" className="button-spinner" /></IonButton>
                            :
                            <IonButton expand="block" color="primary" onClick={() => storeItem()} disabled={false}>Save</IonButton>
                        }
                        {errors.map((error, key) => (
                            <div className="form-error" key={"error-" + key}>{error}</div>
                        ))}
                    </section>
                </IonList>
            </IonContent>
        </IonPage>
    );

};

export default ItemsCreate;