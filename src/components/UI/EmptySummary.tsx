import {Card} from "@blueprintjs/core";
import * as React from 'react';
import './UI.css';

export class EmptySummary extends React.Component<any, any> {

    public render() {
        return (<div className="CardContainer">
            <Card className="Card">
                <p>
                    No Details
                </p>
            </Card>
        </div>);
    }
}
