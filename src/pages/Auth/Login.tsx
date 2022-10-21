import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router";
import {
    IonContent, IonPage, IonGrid, IonRow,
    IonButton, IonList, IonItem, IonLabel, IonInput, IonSpinner
} from '@ionic/react';
import './Login.css';
import AuthContext from "../../contexts/Context";
import { Network } from '@capacitor/network';
import { SplashScreen } from '@capacitor/splash-screen';
import { Preferences } from '@capacitor/preferences';

const Login: React.FC = () => {

    const [email_address, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<[]>([]);
    const { login } = React.useContext(AuthContext);
    const [spinner, setSpinner] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);
    const history = useHistory();

    const previousLogin = async () => {
        //await Storage.remove({ key: 'token' });
        //await Storage.set({key: 'token', value: "test"});

        Network.getStatus().then(status => {
            if (!status.connected) {
                setTimeout(function () { //Start the timer
                    SplashScreen.hide();
                }, 100);
            } else {
                Preferences.get({ key: 'token' }).then(e => tokenLogin(e));
            }
        });
    }
    const tokenLogin = async (e: any) => {
        
        if (e.value) {
            await login({ user: "", password: "", token: e.value }).then(function (data: any) {
                setSpinner(false);
                if (data === true) {
                    history.replace("/bookings")
                    setTimeout(function () { //Start the timer
                        SplashScreen.hide();
                    }, 100);
                } else {
                    setTimeout(function () { //Start the timer
                        SplashScreen.hide();
                    }, 100);
                }
            })
        } else {
            setSpinner(false);
            setTimeout(function () { //Start the timer
                SplashScreen.hide();
            }, 100);
        }
    }

    useEffect(() => {
        previousLogin();
    }, [])

    const attemptLogin = async () => {
        setUploading(true);
        let result = await login({ user: email_address, password: password });
        setUploading(false);
        if (result === true) {
            history.replace("/bookings");
        } else {
            setErrors(result);
        }
    }
    return (
        <IonPage>
            {spinner ?
                <IonContent className="ion-padding login-spin-form">
                    <div className="spinner-wrapper">
                        <IonSpinner name="crescent" color={"light"} />
                    </div>
                </IonContent>
                :
                <IonContent className="ion-padding login-form">

                    <IonGrid className="login-form-wrapper">
                        <IonRow>
                            <IonList>
                                <IonItem class="ion-no-padding" >
                                    <IonLabel position="stacked">Email Address</IonLabel>
                                    <IonInput type="email" onIonChange={(e: any) => setEmail(e.target.value)} ></IonInput>
                                </IonItem>
                                <IonItem class="ion-no-padding ">
                                    <IonLabel position="stacked">Password</IonLabel>
                                    <IonInput type="password" onIonChange={(e: any) => setPassword(e.target.value)} ></IonInput>
                                </IonItem>
                            </IonList>
                        </IonRow>
                        <IonRow className="pt-30">
                            {errors.map((error, key) => (
                                <div className="form-error" key={"error-" + key}>{error}</div>
                            ))}
                        </IonRow>
                        <IonRow>
                            {uploading ?
                                <IonButton expand="block" color="primary" disabled={true} className="login-button"><IonSpinner name="crescent" className="button-spinner" /></IonButton>
                                :
                                <IonButton expand="block" color="primary" onClick={() => attemptLogin()} disabled={false} className="login-button">Log In</IonButton>
                            }
                        </IonRow>
                        {/* 
                    <IonRow>
                        <div className="sign-up">Don't have an account? <div className="div-link" onClick={e => { window.open('https://liverylive.com/register', '_system', 'location=yes'); return false; }}><b>Join</b></div> </div>
                    </IonRow>
                    */}
                    </IonGrid>


                </IonContent>
            }

        </IonPage >
    );
};

export default Login;