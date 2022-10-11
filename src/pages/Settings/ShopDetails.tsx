import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonButtons, IonButton,
    IonInput, useIonViewWillEnter, IonToast, IonSpinner
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { AppBackButton } from '../../components/AppBackButton';

const ShopDetails: React.FC = () => {

    const { api_url, api_key, authValues } = useContext(AuthContext);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [errors, setErrors] = useState<[]>([]);
    const [success, setSuccess] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [telephone, setTelephone] = useState<string>("");
    const [mobile, setMobile] = useState<string>("");
    const [address1, setAddress1] = useState<string>("");
    const [address2, setAddress2] = useState<string>("");
    const [address3, setAddress3] = useState<string>("");
    const [town, setTown] = useState<string>("");
    const [county, setCounty] = useState<string>("");
    const [postcode, setPostcode] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);

    useIonViewWillEnter(() => {
        fetchData();
    });

    function fetchData() {
        axios.get(api_url + 'shops/' + authValues.user.id + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type)
            .then((res: any) => {
                setName(res.data.name);
                setEmail(res.data.email);
                setTelephone(res.data.telephone);
                setMobile(res.data.mobile);
                setAddress1(res.data.address_line_1);
                setAddress2(res.data.address_line_2);
                setAddress3(res.data.address_line_3);
                setTown(res.data.town);
                setCounty(res.data.county);
                setPostcode(res.data.postcode);
            }).catch((error: any) => {
                setShowToast(true);
            });
    }

    function update() {
        setUploading(true);
        const data = {
            name: name,
            email: email,
            telephone: telephone,
            mobile: mobile,
            address1: address1,
            address2: address2,
            address3: address3,
            town: town,
            county: county,
            postcode: postcode,
            resource_id: authValues.user.id+"",
            resource_type: authValues.user.type,
        };

        axios.patch(api_url + 'shops/' + authValues.user.id + '/update' + api_key, data)
            .then((res: any) => {
                console.log(res.data);
                setUploading(false);
                setSuccess("Details updated successfully.");
                setErrors([]);
            }).catch((error: any) => {
                setUploading(false);
                setSuccess("");
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
                        <AppBackButton/>
                    </IonButtons>
                    <IonTitle>Edit Details</IonTitle>
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
                        <IonLabel position="stacked">Email: </IonLabel>
                        <IonInput type="email" onIonChange={e => setEmail(e.detail.value as string)} value={email}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Telephone Number: </IonLabel>
                        <IonInput type="tel" onIonChange={e => setTelephone(e.detail.value as string)} value={telephone}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Mobile Number: </IonLabel>
                        <IonInput type="tel" onIonChange={e => setMobile(e.detail.value as string)} value={mobile}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Address Line 1: </IonLabel>
                        <IonInput onIonChange={e => setAddress1(e.detail.value as string)} value={address1} autocapitalize="sentences"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Address Line 2: </IonLabel>
                        <IonInput onIonChange={e => setAddress2(e.detail.value as string)} value={address2} autocapitalize="sentences"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Address Line 3: </IonLabel>
                        <IonInput onIonChange={e => setAddress3(e.detail.value as string)} value={address3} autocapitalize="sentences"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Town: </IonLabel>
                        <IonInput onIonChange={e => setTown(e.detail.value as string)} value={town} autocapitalize="sentences"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">County: </IonLabel>
                        <IonInput onIonChange={e => setCounty(e.detail.value as string)} value={county} autocapitalize="sentences"></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Postcode: </IonLabel>
                        <IonInput onIonChange={e => setPostcode(e.detail.value as string)} value={postcode} autocapitalize="sentences"></IonInput>
                    </IonItem>

                    <section className="full-width">
                        {errors.map((error, key) => (
                            <div className="form-error" key={"error-" + key}>{error}</div>
                        ))}
                        {success &&
                            <div className="form-success">{success}</div>
                        }
                        {uploading ?
                            <IonButton expand="block" color="primary" disabled={true}><IonSpinner name="crescent" className="button-spinner" /></IonButton>
                            :
                            <IonButton expand="block" color="primary" onClick={() => update()} disabled={false}>Save</IonButton>
                        }
                    </section>
                </IonList>
            </IonContent>
        </IonPage>
    );

};

export default ShopDetails;