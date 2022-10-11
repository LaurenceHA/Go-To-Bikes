import React, { useState, useContext } from 'react';
import {
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList,
    IonItem, IonLabel, IonButtons, IonButton,
    IonInput, IonToast, IonSpinner
} from '@ionic/react';
import AuthContext from "../../contexts/Context";
import axios from 'axios';
import { AppBackButton } from '../../components/AppBackButton';

const ChangePassword: React.FC = () => {

    const { api_url, api_key, authValues, setUsers } = useContext(AuthContext);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [errors, setErrors] = useState<[]>([]);
    const [success, setSuccess] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [cpassword, setCPassword] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);

    function updatePassword() {
        setUploading(true);
        const data = {
            password: password,
            password_confirmation: cpassword,
            user_id: authValues.user.id
        };

        var url = "";
        if(authValues.user.type === "customer"){
            url = "customers/";
        }
        if(authValues.user.type === "shop"){
            url = "shops/";
        }
        if(authValues.user.type === "volunteer"){
            url = "volunteers/";
        }

        axios.patch(api_url + url + authValues.user.id + '/password' + api_key + '&resource_id=' + authValues.user.id + '&resource_type=' + authValues.user.type, data)
            .then((res: any) => {
                setUploading(false);
                setSuccess("Password updated successfully.");
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
                    <IonTitle>Edit Password</IonTitle>
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
                        <IonLabel>Password: </IonLabel>
                        <IonInput type = "password" onIonChange={e => setPassword(e.detail.value as string)} value={password}></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Confirm Password: </IonLabel>
                        <IonInput type = "password" onIonChange={e => setCPassword(e.detail.value as string)} value={cpassword}></IonInput>
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
                            <IonButton expand="block" color="primary" onClick={() => updatePassword()} disabled={false}>Save</IonButton>
                        }
                    </section>
                </IonList>
            </IonContent>
        </IonPage>
    );

};

export default ChangePassword;