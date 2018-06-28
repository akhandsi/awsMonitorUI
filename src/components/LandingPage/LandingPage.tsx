import * as React from 'react';
import {Topology} from "../Topology/Topology";
import './LandingPage.css';

export class LandingPage extends React.Component {
    public render() {
        return (
            <div className="LandingPage">
                <Topology/>
            </div>
        );
    }
}
