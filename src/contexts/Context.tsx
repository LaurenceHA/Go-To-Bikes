import React, { createContext, useState } from "react";
import { Preferences } from '@capacitor/preferences';
import axios from 'axios';

export const AuthContext = createContext<any>(undefined);

export const AuthProvider = (props:any) => {

    const api_url = "https://goto.pmclient.co.uk/api/";
    const api_key = "?api_token=RtbAZ662euvdfMyVb3qrCJ9wLBcT7wHJifoeviqN";

    const [authValues, setAuthValues] = useState<any>({
        authenticated: false,
        user: null
    });
    const [hideTabs, setHideTabs] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);

    const login = ({ user, password, token }: { user: string; password: string, token: string }) => {
        return new Promise<any>((resolve) => {

            if (token) {
                const auth = {
                    token: token
                };
                axios.post(api_url + 'token' + api_key, auth)
                    .then((res:any)  => {

                        setAuthValues({
                            authenticated: true,
                            user: {
                                id: res.data.id,
                                type: res.data.user_type,
                            }
                        });
                        Preferences.set({
                            key: 'token',
                            value: res.data.app_token,
                        }).then((e:any) => resolve(true));
                        
                    }).catch((error:any) => {
                        //Storage.remove({ key: 'token' });
                        resolve(false);
                    });

            } else {

                const auth = {
                    email: user,
                    password: password
                };
                axios.post(api_url + 'login' + api_key, auth)
                    .then((res:any) => {
                        setAuthValues({
                            authenticated: true,
                            user: {
                                id: res.data.id,
                                type: res.data.user_type,
                            }
                        });
                        Preferences.set({
                            key: 'token',
                            value: res.data.app_token,
                        }).then((e:any) => resolve(true));
                    }).catch((error:any) => {
                        if (error.response && error.response.status === 422) {
                            const error_return = Object.values(JSON.parse(error.response.request.response));
                            resolve(error_return);
                        } else {
                            resolve(["An error occurred, please try again later."]);
                        }

                    });
            }
        });
    }

    const tokenCheck = ({ token }: { token: string }) => {
        return new Promise<any>((resolve) => {

            if (token) {
                const auth = {
                    token: token
                };
                axios.post(api_url + 'logged_in_token' + api_key, auth)
                    .then((res:any) => {
                        setAuthValues({
                            authenticated: true,
                            user: {
                                id: res.data.id,
                                type: res.data.user_type,
                            }
                        });
                        Preferences.set({
                            key: 'token',
                            value: res.data.app_token,
                        }).then((e:any) => resolve(true));
                    }).catch((error:any) => {
                        setAuthValues({
                            authenticated: false,
                            user: null
                        });
                        Preferences.remove({ key: 'token' });
                        resolve(false);
                    });

            } else {
                setAuthValues({
                    authenticated: false,
                    user: null
                });
                Preferences.remove({ key: 'token' });
            }
        });
    }

    const logout = () => {
        return new Promise<any>((resolve) => {
            setAuthValues({
                authenticated: false,
                user: null
            });
            Preferences.remove({ key: 'token' });
            Preferences.get({ key: 'device_id' }).then((e:any) => {
                if (e.value) {
                    const user = {
                        user_id: authValues.user.id,
                        device: e.value,
                    };
                    axios.post(api_url + 'logout' + api_key, user)
                        .then((res:any) => {
                            Preferences.remove({ key: 'device_id' }).then((e:any) => {
                                resolve(true);
                            });
                        }).catch((error:any) => {
                            resolve(true);
                        });
                } else {
                    resolve(true);
                }
            });
        });
    }

    let state = {
        api_url,
        api_key,
        authValues,
        setAuthValues,
        showToast,
        setShowToast,
        hideTabs,
        setHideTabs,
        login,
        tokenCheck,
        logout
    };

    return <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;