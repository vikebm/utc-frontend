import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { Auth, Bookings, Utc } from "../screens";

const authenticated = () => {
    return localStorage.getItem("token");
}

export default function Routes() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login" render={() => <Auth />} />
                    <Route exact path="/bookings" render={() => authenticated() ? <Bookings /> : <Auth />} />
                    <Route exact path="/utc-converter" render={() => <Utc />} />
                    <Route exact path="*" render={() => <Auth />} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}
